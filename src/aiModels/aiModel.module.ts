import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { UserModule } from '../database/services/user.module';
import { AiModelController } from './aiModel.controller';
import { AiModelService } from './aiModel.service';
import { AuthModule } from '../auth/auth.module';
import { BothubService } from '../bothub/bothub.service';

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  controllers: [AiModelController],
  providers: [AiModelService, BothubService],
})
export class AiModelModule {}
