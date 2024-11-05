import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(this.constructor.name);

  async onModuleInit() {
    this.logger.log('Connecting to the db...');
    await this.$connect();
    this.logger.log('Database connection established.');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from the db...');
    await this.$disconnect();
    this.logger.log('Database connection closed.');
  }
}
