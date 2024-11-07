import { Module } from '@nestjs/common';
import { UsersService } from '../database/services/user.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, UsersService, JwtAuthGuard, RolesGuard],
})
export class ProfileModule {}
