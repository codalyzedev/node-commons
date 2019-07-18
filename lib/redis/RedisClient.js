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
const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisRetryStrategy = (options) => {
    console.log("Redis retry strategy", options);
    if (options.error && options.error.code === 'ECONNREFUSED') {
        return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Retry time exhausted');
    }
    return Math.min(options.attempt * 100, 3000);
};
class RedisClient {
    constructor(url) {
        this.client = redis.createClient({
            url,
            retry_strategy: redisRetryStrategy
        });
    }
    getAsync(key) {
        return this.client.getAsync(key);
    }
    set(key, value) {
        return this.client.set(key, value);
    }
    setWithExpiration(key, value, timeoutInSeconds) {
        return this.client.set(key, value, 'EX', timeoutInSeconds);
    }
    setObjectWithExpiration(key, object, timeoutInSeconds) {
        return this.client.set(key, JSON.stringify(object), 'EX', timeoutInSeconds);
    }
    getObject(key) {
        return this.client.getAsync(key)
            .then(objString => {
            if (!objString)
                return null;
            return JSON.parse(objString);
        });
    }
    scan(cursor, pattern, count = 100) {
        return this.client.scanAsync(cursor, 'MATCH', pattern, 'COUNT', count);
    }
    del(key) {
        return this.client.delAsync(key);
    }
    delByPattern(pattern, cursor = '0') {
        return __awaiter(this, void 0, void 0, function* () {
            const reply = yield this.scan(cursor, pattern, 1);
            const keys = reply[1];
            for (const key of keys) {
                yield this.del(key);
            }
            if (reply[0] === '0') {
                return bluebird.resolve();
            }
            return this.delByPattern(pattern, reply[0]);
        });
    }
    hmSet(key, object) {
        return this.client.hmsetAsync(key, object);
    }
    hmSetWithExpiration(key, object, timeoutInSeconds) {
        return new bluebird((resolve, reject) => {
            this.client.HMSET(key, object, (err) => {
                if (err)
                    reject(err);
                else {
                    this.client.expire(key, timeoutInSeconds);
                    resolve();
                }
            });
        });
    }
    hgetAll(key) {
        return new bluebird((resolve, reject) => {
            this.client.hgetall(key, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    remove(key) {
        return this.client.del(key);
    }
    rpush(key, value) {
        return this.client.rpush(key, value);
    }
    blpop(key, value, func) {
        return this.client.blpop(key, value, func);
    }
    llen(key) {
        return new bluebird((resolve) => {
            this.client.llen(key, (_err, length) => {
                resolve(length);
            });
        });
    }
    publish(channel, message) {
        return this.client.publish(channel, message);
    }
}
exports.RedisClient = RedisClient;
exports.default = RedisClient;
//# sourceMappingURL=RedisClient.js.map