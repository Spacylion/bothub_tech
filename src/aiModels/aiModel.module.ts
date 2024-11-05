import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../database/prisma.module';
import { UserModule } from '../database/services/user.module';
import { AiModelController } from './aiModel.controller';
import { AiModelService } from './aiModel.service';

@Module({
  imports: [ConfigModule, PrismaModule, UserModule],
  controllers: [AiModelController],
  providers: [
    AiModelService,
    {
      provide: 'API_KEYS',
      useFactory: (configService: ConfigService) => ({
        mistralApiKey: configService.get<string>('mistral_api_key'),
        chatGptV3ApiKey: configService.get<string>('chat_gpt_v3_api_key'),
      }),
      inject: [ConfigService],
    },
  ],
})
export class AiModelModule {}
