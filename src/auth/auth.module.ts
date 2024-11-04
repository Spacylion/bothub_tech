import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../db/service/users.service';
import { PrismaModule } from '../db/service/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
