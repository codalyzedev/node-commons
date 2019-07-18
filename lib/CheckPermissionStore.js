"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class CheckPermissionStore {
    constructor(db, redisClient) {
        this.db = db;
        this.redisClient = redisClient;
    }
    checkUserPermission(userId, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.oneOrNone(`
      SELECT *
      FROM role_user_permissions
      WHERE user_id = $1 AND
      permission_id = (
        SELECT permission_id FROM permissions WHERE permission_name = $2
        )
    `, [userId, permission]);
            return result ? result.enabled === 'true' : null;
        });
    }
    checkRolePermission(roleId, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.oneOrNone(`
      SELECT *
      FROM role_user_permissions
      WHERE role_id = $1 AND
      permission_id = (
        SELECT permission_id FROM permissions WHERE permission_name = $2
        )
    `, [roleId, permission]);
            return result ? (result.enabled === true ? true : false) : false;
        });
    }
    checkPermission(roleId, userId, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInRedis = yield this.redisClient.getObject(`user:${userId}`);
            if (userInRedis) {
                const permItem = userInRedis.permissions.find((perm) => perm.permission_name === permission);
                return permItem && permItem.enabled;
            }
            const userPermission = yield this.checkUserPermission(userId, permission);
            if (userPermission) {
                return true;
            }
            const rolePermission = yield this.checkRolePermission(roleId, permission);
            if (rolePermission) {
                return true;
            }
            return false;
        });
    }
}
exports.default = CheckPermissionStore;
//# sourceMappingURL=CheckPermissionStore.js.map