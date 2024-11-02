import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import redisConfig from '../../config/redis.config';
import { ConfigModule } from '@nestjs/config';

describe('RedisService', () => {
  let service: RedisService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(redisConfig)],
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined and connecting', () => {
    expect(service).toBeDefined();
    expect(service.status).toBe('connecting');
  });

  afterAll(async () => {
    service.onModuleDestroy();
  });
});
