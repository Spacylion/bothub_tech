import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../database/services/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, password: string): Promise<User> {
    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.createUser(username, password);
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.validateUser(username, password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      access_token: accessToken,
    };
  }
}
