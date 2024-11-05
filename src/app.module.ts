import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurationValidationSchema } from './config/configuration';
import { RepositoriesModule } from './database/repositories/repositories.module';
import { UserRepository } from './database/repositories/user.repository';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './database/prisma.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
  controllers: [],
  providers: [
    UserRepository,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
