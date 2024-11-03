import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UsersService } from '../../db/repository/user.repository';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly usersService: UsersService,
  ) {}

  async generateToken(user: {
    id: number;
    username: string;
    role: string;
  }): Promise<string> {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return this.usersService.findUserByUsername(decoded.username);
    } catch (error) {
      return null;
    }
  }
}
