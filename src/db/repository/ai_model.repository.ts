import { AiModel } from '@prisma/client';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../service/prisma.service";

export interface IAiModelRepository {
  createAiModel(
    data: Omit<AiModel, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AiModel>;

  findAiModelById(id: number): Promise<AiModel | null>;

  findAiModelByName(name: string): Promise<AiModel | null>;

  updateAiModel(id: number, data: Partial<AiModel>): Promise<AiModel>;

  deleteAiModel(id: number): Promise<void>;
}

@Injectable()
export class AiModelRepository implements IAiModelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAiModel(
    data: Omit<AiModel, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AiModel> {
    return this.prisma.aiModel.create({ data });
  }

  async findAiModelById(id: number): Promise<AiModel | null> {
    return this.prisma.aiModel.findUnique({ where: { id } });
  }

  async findAiModelByName(name: string): Promise<AiModel | null> {
    return this.prisma.aiModel.findUnique({ where: { name } });
  }

  async updateAiModel(id: number, data: Partial<AiModel>): Promise<AiModel> {
    return this.prisma.aiModel.update({ where: { id }, data });
  }

  async deleteAiModel(id: number): Promise<void> {
    await this.prisma.aiModel.delete({ where: { id } });
  }
}