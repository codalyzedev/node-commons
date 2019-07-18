/// <reference types="node" />
import * as redis from 'redis';
import * as bluebird from 'bluebird';
declare module 'redis' {
    interface RedisClient extends NodeJS.EventEmitter {
        getAsync(...args: any[]): bluebird<any>;
        scanAsync(...args: any[]): bluebird<any>;
        delAsync(...args: any[]): bluebird<any>;
        hmsetAsync(...args: any[]): bluebird<any>;
    }
}
export declare class RedisClient {
    client: redis.RedisClient;
    constructor(url: string);
    getAsync(key: string): bluebird<any>;
    set(key: string, value: string): boolean;
    setWithExpiration(key: string, value: string, timeoutInSeconds: number): boolean;
    setObjectWithExpiration(key: string, object: any, timeoutInSeconds: number): boolean;
    getObject(key: string): bluebird<any>;
    scan(cursor: string, pattern: string, count?: number): bluebird<any>;
    del(key: string): bluebird<any>;
    delByPattern(pattern: string, cursor?: string): Promise<any>;
    hmSet(key: string, object: any): bluebird<any>;
    hmSetWithExpiration(key: string, object: any, timeoutInSeconds: number): bluebird<unknown>;
    hgetAll(key: string): bluebird<unknown>;
    remove(key: string): boolean;
    rpush(key: string, value: string): boolean;
    blpop(key: string, value: number, func: redis.Callback<[string, string]>): boolean;
    llen(key: string): bluebird<any>;
    publish(channel: string, message: string): boolean;
}
export default RedisClient;
