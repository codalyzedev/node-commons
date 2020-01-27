import * as express from "express";
import RedisClient from "../redis/RedisClient";
declare class CheckPermissionsMw {
    db: any;
    redisClient: RedisClient;
    appConfigStore: any;
    checkPermissionStore: any;
    appLockActionMap: any;
    constructor(db: any, redisClient: RedisClient);
    handler: (requestedPermissions: string[]) => (req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: express.NextFunction) => Promise<void>;
    isPermissionAllowed(permission: string, roleId: string, userId: string): Promise<any>;
}
export default CheckPermissionsMw;
