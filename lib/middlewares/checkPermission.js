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
const AppConfigStore_1 = require("../AppConfigStore");
const CheckPermissionStore_1 = require("../CheckPermissionStore");
class CheckPermissionsMw {
    constructor(db, redisClient) {
        this.handler = (requestedPermissions) => (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let isAllowed = true;
            let i = 0;
            let allowed = false;
            while (i < requestedPermissions.length) {
                allowed = yield this.isPermissionAllowed(requestedPermissions[i], req.currentUser.role_id, req.currentUser.user_id);
                if (!allowed) {
                    isAllowed = false;
                    break;
                }
                i++;
            }
            if (!isAllowed) {
                res.status(403).send('INVALID_REQUEST_TOKEN');
                return;
            }
            next();
        });
        this.db = db;
        this.redisClient = redisClient;
        this.appConfigStore = new AppConfigStore_1.default(db, redisClient);
        this.checkPermissionStore = new CheckPermissionStore_1.default(db, redisClient);
        this.appLockActionMap = {
            CREATE_MEMO: 'CREATE_MEMO_ON_APP_LOCK',
            APPROVE_MEMO: 'APPROVE_MEMO_ON_APP_LOCK',
            SHORT_MEMO: 'SHORT_MEMO_ON_APP_LOCK'
        };
    }
    isPermissionAllowed(permission, roleId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAppLocked = yield this.appConfigStore.getValue('APP_LOCK');
            if (this.appLockActionMap[permission] && isAppLocked) {
                return this.checkPermissionStore.checkPermission(roleId, userId, this.appLockActionMap[permission]);
            }
            return this.checkPermissionStore.checkPermission(roleId, userId, permission);
        });
    }
}
exports.default = CheckPermissionsMw;
//# sourceMappingURL=checkPermission.js.map