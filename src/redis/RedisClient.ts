import * as redis from 'redis';
import * as bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    getAsync(...args: any[]): bluebird<any>;
    scanAsync(...args: any[]): bluebird<any>;
    delAsync(...args: any[]): bluebird<any>;
    hmsetAsync(...args: any[]): bluebird<any>;
  }
}

const redisRetryStrategy = (options: redis.RetryStrategyOptions) => {
  console.log("Redis retry strategy", options);
  if (options.error && options.error.code === 'ECONNREFUSED') {
    return new Error('The server refused the connection');
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    return new Error('Retry time exhausted');
  }
  return Math.min(options.attempt * 100, 3000);
};

export class RedisClient {
  client: redis.RedisClient;

  constructor (url: string) {
    // this.client = bluebird.promisifyAll(
    //   redis.createClient({
    //     url,
    //     retry_strategy: redisRetryStrategy
    //   })
    // );

    this.client = redis.createClient({
      url,
      retry_strategy: redisRetryStrategy
    });
  }
  getAsync (key: string) {
    return this.client.getAsync(key);
  }
  set (key: string, value: string) {
    return this.client.set(key, value);
  }
  setWithExpiration (key: string, value: string, timeoutInSeconds: number) {
    return this.client.set(key, value, 'EX', timeoutInSeconds);
  }
  setObjectWithExpiration (key: string, object: any, timeoutInSeconds: number) {
    return this.client.set(key, JSON.stringify(object), 'EX', timeoutInSeconds);
  }
  getObject (key: string) {
    return this.client.getAsync(key)
      .then(objString => {
        if (!objString) return null;
        return JSON.parse(objString)
      });
  }
  scan (cursor: string, pattern: string, count: number = 100) {
    return this.client.scanAsync(cursor, 'MATCH', pattern, 'COUNT', count);
  }
  del (key: string) {
    return this.client.delAsync(key);
  }
  async delByPattern (pattern: string, cursor = '0'): Promise<any> {
    const reply = await this.scan(cursor, pattern, 1);

    const keys = reply[1];

    for (const key of keys) {
      await this.del(key);
    }

    if (reply[0] === '0') {
      return bluebird.resolve();
    }

    return this.delByPattern(pattern, reply[0]);
  }
  hmSet (key: string, object: any) {
    return this.client.hmsetAsync(key, object);
  }
  hmSetWithExpiration (key: string, object: any, timeoutInSeconds: number) {
    return new bluebird((resolve: Function, reject: Function) => {
      this.client.HMSET(key, object, (err) => {
        if (err) reject(err);
        else {
          this.client.expire(key, timeoutInSeconds);
          resolve();
        }
      })
    });
  }
  hgetAll (key: string) {
    return new bluebird((resolve, reject) => {
      this.client.hgetall(key, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }
  remove (key: string) {
    return this.client.del(key);
  }
  rpush (key: string, value: string) {
    return this.client.rpush(key, value);
  }
  blpop (key: string, value: number, func: redis.Callback<[string, string]>) {
    return this.client.blpop(key, value, func);
  }
  llen (key: string): bluebird<any> {
    return new bluebird((resolve: Function) => {
      this.client.llen(key, (_err: any, length: any) => {
        resolve(length);
      });
    });
  }
  publish (channel: string, message: string) {
    return this.client.publish(channel, message);
  }
  // lpop (key, func) {
  //   return this.client.lpop(key, func);
  // }
}

export default RedisClient;
