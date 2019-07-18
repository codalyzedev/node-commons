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
const stringToBool = (str) => {
    if (str === 'true') {
        return true;
    }
    if (str === 'false') {
        return false;
    }
    return false;
};
const serializeForRedis = (obj) => {
    const flatObj = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] === null) {
            flatObj[key] = false;
            return;
        }
        if (typeof obj[key] === 'object') {
            flatObj[key] = JSON.stringify(obj[key]);
            return;
        }
        flatObj[key] = obj[key];
    });
    return flatObj;
};
class AppConfigStore {
    constructor(db, redisClient) {
        this.db = db;
        this.redisClient = redisClient;
    }
    getValue(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultInRedis = yield this.redisClient.hgetAll(`appConfig:${key}`);
            if (resultInRedis) {
                if (resultInRedis.data_type === 'boolean') {
                    return stringToBool(resultInRedis.value);
                }
                else {
                    return resultInRedis.value;
                }
            }
            let value = null;
            const result = yield this.db.oneOrNone(`SELECT * FROM app_config WHERE key = $1`, key);
            if (!result) {
                value = null;
            }
            else if (result.data_type === 'boolean') {
                value = stringToBool(result.value);
            }
            else {
                value = result.value;
            }
            if (value !== null) {
                yield this.redisClient.hmSet(`appConfig:${key}`, serializeForRedis(Object.assign({}, result, { value })));
            }
            return value;
        });
    }
}
exports.default = AppConfigStore;
//# sourceMappingURL=AppConfigStore.js.map