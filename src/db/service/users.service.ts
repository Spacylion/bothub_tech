import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: UserRole.USER,
        balance: 0,
      },
    });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async updateUserRole(userId: number, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async updateBalance(userId: number, amount: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
    });
  }
}
