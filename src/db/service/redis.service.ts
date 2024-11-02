import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import redisConfig from '../../config/redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(this.constructor.name);
  private readonly client: Redis;

  constructor(
    @Inject(redisConfig.KEY) private readonly config: () => any, // Adjusted to a function type
  ) {
    this.client = new Redis(this.config()); // Call the function to get the configuration

    this.client.on('connect', this.handleConnect.bind(this));
    this.client.on('ready', this.handleReady.bind(this));
    this.client.on('error', this.handleError.bind(this));
    this.client.on('close', this.handleClose.bind(this));
    this.client.on('reconnecting', this.handleReconnecting.bind(this));
    this.client.on('end', this.handleEnd.bind(this));

    this.showConnectionStatus();
  }

  onModuleDestroy() {
    this.client.disconnect(false);
  }

  private showConnectionStatus() {
    this.logger.log(`Redis connection status: ${this.client.status}`, {
      type: 'REDIS_STATUS',
    });
  }

  private handleConnect() {
    this.logger.log('Redis connecting...', { type: 'REDIS_CONNECTING' });
  }

  private handleReady() {
    this.logger.log('Redis connected!', { type: 'REDIS_CONNECTED' });
  }

  private handleClose() {
    this.logger.warn('Redis disconnected!', { type: 'REDIS_DISCONNECTED' });
  }

  private handleReconnecting() {
    this.logger.log('Redis reconnecting!', { type: 'REDIS_RECONNECTING' });
  }

  private handleEnd() {
    this.logger.warn('Redis connection ended!', { type: 'REDIS_CONN_ENDED' });
  }

  private handleError(err: any) {
    this.logger.error('Redis error occurred', { type: 'REDIS_ERROR', err });
  }
}
