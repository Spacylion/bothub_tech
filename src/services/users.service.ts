import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST);
    }

    await this.validatePassword(password);

    const hashedPassword = await bcrypt.hash(password, 5);
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
    const user = (await this.prisma.user.findUnique({
      where: { username },
    })) as User;
    if (user && (await compare(password, user.password))) {
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

  private async validatePassword(password: string) {
    const minLength = 6;
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      throw new HttpException(
        'Password must be at least 6 characters long',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!specialCharacterRegex.test(password)) {
      throw new HttpException(
        'Password must contain at least one special character',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
