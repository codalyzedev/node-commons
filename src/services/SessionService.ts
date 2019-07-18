import JWTService from './JWTService';
import * as uuid from 'uuid';
import * as config from 'config';
import * as pgPromise from 'pg-promise';
import RedisClient from '../redis/RedisClient';

class SessionService {
  db: pgPromise.IDatabase<any>;
  jwtService: JWTService;
  jwtExpiresIn: number;
  redisClient: RedisClient;

  constructor (dbConn: pgPromise.IDatabase<any>, redisClient: RedisClient) {
    this.db = dbConn;
    this.jwtExpiresIn = 3000;
    this.jwtService = new JWTService(this.jwtExpiresIn);
    this.redisClient = redisClient;
  }

  get jwtCookieOptions () {
    return {
      maxAge: this.jwtExpiresIn * 1000,
      secure: config.get('SESSION_COOKIE_SECURE') as boolean,
      httpOnly: true,
      path: '/'
    };
  }

  get refreshCookieOptions () {
    return {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: config.get('SESSION_COOKIE_SECURE') as boolean,
      httpOnly: true,
      path: '/'
    };
  }

  async getUserById (userId: string) {
    const userInRedis = await this.redisClient.getObject(`user:${userId}`);

    if (userInRedis) {
      return userInRedis;
    }

    const userWithPermissions = await this.db.task(async t => {
      const user = await t.one(`
        SELECT 
          *,
          (users.first_name || ' '  || users.last_name) as name
        from users
          INNER JOIN user_roles
          ON user_roles.role_id = users.role_id
        WHERE user_id = $1
      `, userId);

      const permissions = await t.any(`
        SELECT
        p.permission_name,
        COALESCE(rup2.enabled, rup1.enabled, false) AS enabled
        FROM permissions p
        LEFT JOIN role_user_permissions rup1
          ON
            rup1.permission_id = p.permission_id
            AND rup1.user_id IS NULL
            AND rup1.role_id = $1
        LEFT JOIN role_user_permissions rup2
        ON
          rup2.permission_id = p.permission_id
          AND rup2.role_id IS NULL
          AND rup2.user_id = $2
      `, [user.role_id, user.user_id]);

      return {
        ...user,
        permissions
      };
    });

    this.redisClient.setObjectWithExpiration(`user:${userId}`, userWithPermissions, 60 * 60);

    return userWithPermissions;
  }

  async createSession (userId: string, ua: string | null, ip: string | null) {
    const sessionId = uuid.v4();

    const session: any = await this.db.one(`
      INSERT INTO sessions
      (session_id, user_id, expires_at, user_agent, ip_address)
      VALUES
      ($1, $2, NOW() + interval '30 minutes', $3, $4)
      RETURNING *
    `, [sessionId, userId, ua, ip]);

    const jwt = this.jwtService.sign({userId});

    return {sessionId: session.session_id, jwt, user: await this.getUserById(userId)};
  }

  async generateRefreshToken (sessionId: string) {
    const session: any = await this.db.oneOrNone(`
      SELECT * FROM active_sessions
      WHERE session_id = $1
    `, sessionId);

    if (!session) {
      return null;
    }

    await this.db.none(`
      UPDATE sessions
      SET expires_at = NOW() + '30 minutes'
      WHERE session_id = $1
    `, sessionId);

    const userId = session.user_id;

    const jwt = this.jwtService.sign({userId});

    return {sessionId: session.id, jwt, user: await this.getUserById(userId)};
  }

  getUserFromSession (token: string) {
    if (!token) {
      return null;
    }

    try {
      const decoded: any = this.jwtService.verify(token);
      return this.getUserById(decoded.userId);
    } catch (e) {
      if (e.name === 'TokenExpiredError' || e.name === 'JsonWebTokenError' || e.name === 'NotBeforeError') {
        return null;
      }

      console.log(e);
      return null;
    }
  }

  logout (sessionId: string) {
    return this.db.none(`
      UPDATE sessions SET logged_out_at = NOW() WHERE session_id = $1
    `, sessionId);
  }

  getActiveSessionsFor (userId: string) {
    return this.db.any(`
      SELECT * FROM active_sessions WHERE user_id = $1
    `, userId);
  }
}

export default SessionService;
