import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async createUser(username: string, hashedPassword: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: UserRole.USER,
        selectedModelId: null,
      },
    });
    return user;
  }

  async updateUserRole(userId: number, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async findUserById(userId: number): Promise<User> {
    if (!userId) {
      throw new Error('User ID cannot be undefined or null');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { models: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user as User;
  }

  async updateUserModel(userId: number, modelId: number | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        selectedModelId: modelId,
      },
    });
  }

  async updateUserBalance(userId: number, newBalance: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
  }
}
