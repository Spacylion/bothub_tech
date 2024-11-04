import { Token } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';

export interface ITokenRepository {
  createToken(data: Omit<Token, 'id' | 'createdAt'>): Promise<Token>;

  findTokenById(id: number): Promise<Token | null>;

  findTokensByUserId(userId: number): Promise<Token[]>;

  updateToken(id: number, data: Partial<Token>): Promise<Token>;

  deleteToken(id: number): Promise<void>;
}

@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(data: Omit<Token, 'id' | 'createdAt'>): Promise<Token> {
    return this.prisma.token.create({ data });
  }

  async findTokenById(id: number): Promise<Token | null> {
    return this.prisma.token.findUnique({ where: { id } });
  }

  async findTokensByUserId(userId: number): Promise<Token[]> {
    return this.prisma.token.findMany({ where: { userId } });
  }

  async updateToken(id: number, data: Partial<Token>): Promise<Token> {
    return this.prisma.token.update({ where: { id }, data });
  }

  async deleteToken(id: number): Promise<void> {
    await this.prisma.token.delete({ where: { id } });
  }
}