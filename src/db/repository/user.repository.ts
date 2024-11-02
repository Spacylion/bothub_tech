import { Injectable } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { User } from '@prisma/client';

export interface IUserRepository {
  createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;

  findUserById(id: number): Promise<User | null>;

  findUserByUsername(username: string): Promise<User | null>;

  updateUser(id: number, data: Partial<User>): Promise<User>;

  deleteUser(id: number): Promise<void>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}