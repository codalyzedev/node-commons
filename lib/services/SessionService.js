"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const JWTService_1 = require("./JWTService");
const uuid = require("uuid");
const config = require("config");
class SessionService {
    constructor(dbConn, redisClient) {
        this.db = dbConn;
        this.jwtExpiresIn = 3000;
        this.jwtService = new JWTService_1.default(this.jwtExpiresIn);
        this.redisClient = redisClient;
    }
    get jwtCookieOptions() {
        return {
            maxAge: this.jwtExpiresIn * 1000,
            secure: config.get('SESSION_COOKIE_SECURE'),
            httpOnly: true,
            path: '/'
        };
    }
    get refreshCookieOptions() {
        return {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: config.get('SESSION_COOKIE_SECURE'),
            httpOnly: true,
            path: '/'
        };
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInRedis = yield this.redisClient.getObject(`user:${userId}`);
            if (userInRedis) {
                return userInRedis;
            }
            const userWithPermissions = yield this.db.task((t) => __awaiter(this, void 0, void 0, function* () {
                const user = yield t.one(`
        SELECT 
          *,
          (users.first_name || ' '  || users.last_name) as name
        from users
          INNER JOIN user_roles
          ON user_roles.role_id = users.role_id
        WHERE user_id = $1
      `, userId);
                const permissions = yield t.any(`
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
                return Object.assign(Object.assign({}, user), { permissions });
            }));
            this.redisClient.setObjectWithExpiration(`user:${userId}`, userWithPermissions, 60 * 60);
            return userWithPermissions;
        });
    }
    createSession(userId, ua, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionId = uuid.v4();
            const session = yield this.db.one(`
      INSERT INTO sessions
      (session_id, user_id, expires_at, user_agent, ip_address)
      VALUES
      ($1, $2, NOW() + interval '30 minutes', $3, $4)
      RETURNING *
    `, [sessionId, userId, ua, ip]);
            const jwt = this.jwtService.sign({ userId });
            return { sessionId: session.session_id, jwt, user: yield this.getUserById(userId) };
        });
    }
    generateRefreshToken(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.db.oneOrNone(`
      SELECT * FROM active_sessions
      WHERE session_id = $1
    `, sessionId);
            if (!session) {
                return null;
            }
            yield this.db.none(`
      UPDATE sessions
      SET expires_at = NOW() + '30 minutes'
      WHERE session_id = $1
    `, sessionId);
            const userId = session.user_id;
            const jwt = this.jwtService.sign({ userId });
            return { sessionId: session.id, jwt, user: yield this.getUserById(userId) };
        });
    }
    getUserFromSession(token) {
        if (!token) {
            return null;
        }
        try {
            const decoded = this.jwtService.verify(token);
            return this.getUserById(decoded.userId);
        }
        catch (e) {
            if (e.name === 'TokenExpiredError' || e.name === 'JsonWebTokenError' || e.name === 'NotBeforeError') {
                return null;
            }
            console.log(e);
            return null;
        }
    }
    logout(sessionId) {
        return this.db.none(`
      UPDATE sessions SET logged_out_at = NOW() WHERE session_id = $1
    `, sessionId);
    }
    getActiveSessionsFor(userId) {
        return this.db.any(`
      SELECT * FROM active_sessions WHERE user_id = $1
    `, userId);
    }
}
exports.default = SessionService;
//# sourceMappingURL=SessionService.js.map