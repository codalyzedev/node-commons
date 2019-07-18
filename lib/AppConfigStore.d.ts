import RedisClient from "./redis/RedisClient";
declare class AppConfigStore {
    db: any;
    redisClient: RedisClient;
    constructor(db: any, redisClient: RedisClient);
    getValue(key: string): Promise<any>;
}
export default AppConfigStore;
