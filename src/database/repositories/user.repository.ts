import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Plan } from "../../shared/enums";

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
        balance: 10000,
        tokens: {
          create: { amount: 10000 },
        },
        plan: {
          connect: { name: Plan.FREE },
        },
      },
      include: { tokens: true, plan: true },
    });
    return user;
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
