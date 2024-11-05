import { UserRepository } from '../repositories/user.repository';
import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [UserRepository, UsersService, PrismaService],
  exports: [UserRepository, UsersService],
})
export class UserModule {}
