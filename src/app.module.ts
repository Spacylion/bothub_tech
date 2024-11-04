import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configurationValidationSchema } from './config/configuration';
import { RepositoriesModule } from './db/repository/repositories.module';
import { UsersService } from './db/service/users.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './db/service/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: configurationValidationSchema,
    }),
    RepositoriesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, PrismaService],
})
export class AppModule {}
