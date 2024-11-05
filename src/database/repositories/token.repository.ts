import { Token } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(userId: number, amount: number) {
    return this.prisma.token.create({
      data: { userId, amount },
    });
  }

  async findTokenById(id: number) {
    return this.prisma.token.findUnique({
      where: { id },
    });
  }

  async updateToken(id: number, data: Partial<Token>) {
    return this.prisma.token.update({
      where: { id },
      data,
    });
  }

  async deleteToken(id: number) {
    return this.prisma.token.delete({
      where: { id },
    });
  }

  async getAllTokens() {
    return this.prisma.token.findMany();
  }
}
