import * as express from "express";

import AppConfigStore from '../AppConfigStore';
import CheckPermissionStore from '../CheckPermissionStore';
import RedisClient from "../redis/RedisClient";

class CheckPermissionsMw {
  db :any
  redisClient: RedisClient
  appConfigStore : any
  checkPermissionStore : any
  appLockActionMap: any


  constructor (db :any, redisClient: RedisClient) {
    this.db = db;
    this.redisClient = redisClient;
    this.appConfigStore = new AppConfigStore(db, redisClient);
    this.checkPermissionStore = new CheckPermissionStore(db, redisClient);
    this.appLockActionMap = {
      CREATE_BASE: 'CREATE_BASE_ON_APP_LOCK',
      CREATE_TIE_UP: 'CREATE_TIE_UP_ON_APP_LOCK',
      APPROVE_MEMO: 'APPROVE_MEMO_ON_APP_LOCK',
      SHORT_MEMO: 'SHORT_MEMO_ON_APP_LOCK'
    }
  }

  handler = (requestedPermissions: string[]) => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let isAllowed = true;

    let i = 0;
    let allowed = false;

    while (i < requestedPermissions.length) {
      allowed = await this.isPermissionAllowed(requestedPermissions[i], req.currentUser.role_id, req.currentUser.user_id, req.currentUser.delegateeId);

      if ((requestedPermissions[i] !== 'CREATE_BASE' && requestedPermissions[i] !== 'CREATE_TIE_UP')  && req.currentUser.user_id !== req.currentUser.delegateeId) {
        allowed = false;
      }

      if (!allowed) {
        isAllowed = false;
        break;
      }
      i++;
    }

    if (!isAllowed) {
      res.status(403).json({error: 'FORBIDDEN'});
      return;
    }

    next();
  }

  async isPermissionAllowed (permission :  string, roleId : string, userId :string, delegateeId: string) {
    const isAppLocked = await this.appConfigStore.getValue('APP_LOCK');

    if (this.appLockActionMap[permission] && isAppLocked) {
      return this.checkPermissionStore.checkPermission(roleId, userId, delegateeId, this.appLockActionMap[permission]);
    }

    return this.checkPermissionStore.checkPermission(roleId, userId, delegateeId, permission);
  }
}

export default CheckPermissionsMw;