import { AiModel } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AiModelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAiModelById(modelId: number): Promise<AiModel | null> {
    return this.prisma.aiModel.findUnique({
      where: { id: modelId },
    });
  }

  async findAiModelByName(modelName: string): Promise<AiModel | null> {
    return this.prisma.aiModel.findUnique({
      where: { name: modelName },
    });
  }
}
