import RedisClient from "./redis/RedisClient";

const stringToBool = (str : string): boolean => {
  if (str === 'true') {
    return true;
  }

  if (str === 'false') {
    return false;
  }

  return false;
};

const serializeForRedis = (obj: any) => {
  const flatObj: any = {};

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
  db:any
  redisClient: RedisClient

  constructor (db:any, redisClient: RedisClient) {
    this.db = db;
    this.redisClient = redisClient;
  }

  async getValue (key : string) {
    const resultInRedis: any = await this.redisClient.hgetAll(`appConfig:${key}`);

    if (resultInRedis) {
      if (resultInRedis.data_type === 'boolean') {
        return stringToBool(resultInRedis.value);
      } else {
        return resultInRedis.value;
      }
    }

    let value = null;
    const result = await this.db.oneOrNone(`SELECT * FROM app_config WHERE key = $1`, key);

    if (!result) {
      value = null;
    } else if (result.data_type === 'boolean') {
      value = stringToBool(result.value);
    } else {
      value = result.value;
    }

    if (value !== null) {
      await this.redisClient.hmSet(`appConfig:${key}`, serializeForRedis({...result, value}));
    }

    return value;
  }
}


export default AppConfigStore;