import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurationValidationSchema } from './config/configuration';
import { RepositoriesModule } from './database/repositories/repositories.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './database/prisma.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AiModelController } from './aiModels/aiModel.controller';
import { AiModelService } from './aiModels/aiModel.service';
import { UsersService } from './database/services/user.service';
import { UserRepository } from './database/repositories/user.repository';
import { AiModelModule } from './aiModels/aiModel.module';
import { ProfileModule } from './profile/profile.module';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: configurationValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10,
        limit: 3,
      },
    ]),
    RepositoriesModule,
    AuthModule,
  ],
  controllers: [AiModelController, ProfileController],
  providers: [
    UsersService,
    PrismaService,
    AiModelService,
    AiModelModule,
    UserRepository,
    ProfileModule,
    ProfileService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
