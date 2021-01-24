import { Injectable } from '@nestjs/common';
import bluebird = require('bluebird');
import redis = require('redis');

require('dotenv').config();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

@Injectable()
export class RedisService {
  private client: redis.RedisClient | any;

  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  setAsync(key: string, value: string, mode: 'EX' | 'PX', duration: number) {
    return this.client.setAsync(key, value, mode, duration);
  }

  getAsync(key: string) {
    return this.client.getAsync(key);
  }

  delAsync(key: string) {
    return this.client.delAsync(key);
  }

  ttlAsync(key: string) {
    return this.client.ttlAsync(key);
  }
}
