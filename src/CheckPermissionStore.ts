import RedisClient from "./redis/RedisClient";

class CheckPermissionStore {
  db:any
  redisClient: RedisClient


  constructor (db : any, redisClient: RedisClient) {
    this.db = db;
    this.redisClient = redisClient;
  }

  async checkUserPermission (userId : string, permission:string) {
    const result = await this.db.oneOrNone(`
      SELECT *
      FROM role_user_permissions
      WHERE user_id = $1 AND
      permission_id = (
        SELECT permission_id FROM permissions WHERE permission_name = $2
        )
    `, [userId, permission]);

    return result ? result.enabled === 'true' : null;
  }

  async checkRolePermission(roleId : string, permission:string) {
    const result = await this.db.oneOrNone(`
      SELECT *
      FROM role_user_permissions
      WHERE role_id = $1 AND
      permission_id = (
        SELECT permission_id FROM permissions WHERE permission_name = $2
        )
    `, [roleId, permission]);

    return result ? (result.enabled === true ? true : false) : false;
  }

  async checkPermission(roleId : string, userId : string, delegateeId: string, permission : string) {
    const userInRedis = await this.redisClient.getObject(`user:${userId}del:${delegateeId}`);

    if (userInRedis) {
      const permItem = userInRedis.permissions.find((perm: any) => perm.permission_name === permission);
      return permItem && permItem.enabled;
    }

    const userPermission = await this.checkUserPermission(userId, permission);
    if (userPermission) {
      return true;
    }

    const rolePermission = await this.checkRolePermission(roleId, permission);

    if (rolePermission) {
      return true;
    }

    return false;
  }
}

export default CheckPermissionStore