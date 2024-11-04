import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurationValidationSchema } from './config/configuration';
import { RepositoriesModule } from './db/repository/repositories.module';
import { UsersService } from './db/service/users.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './db/service/prisma.service';
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
    UsersService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
