import RedisClient from "./redis/RedisClient";
declare class CheckPermissionStore {
    db: any;
    redisClient: RedisClient;
    constructor(db: any, redisClient: RedisClient);
    checkUserPermission(userId: string, permission: string): Promise<boolean | null>;
    checkRolePermission(roleId: string, permission: string): Promise<boolean>;
    checkPermission(roleId: string, userId: string, permission: string): Promise<any>;
}
export default CheckPermissionStore;
