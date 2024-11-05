import { AiModel } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AiModelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAiModel(name: string, tokenCost: number, creditCost: number) {
    return this.prisma.aiModel.create({
      data: { name, tokenCost, creditCost },
    });
  }

  async findAiModelById(id: number) {
    return this.prisma.aiModel.findUnique({
      where: { id },
    });
  }

  async updateAiModel(id: number, data: Partial<AiModel>) {
    return this.prisma.aiModel.update({
      where: { id },
      data,
    });
  }

  async deleteAiModel(id: number) {
    return this.prisma.aiModel.delete({
      where: { id },
    });
  }

  async getAllAiModels() {
    return this.prisma.aiModel.findMany();
  }
}
