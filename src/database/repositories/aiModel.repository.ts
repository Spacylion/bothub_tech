import { AiModel } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AiModelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAiModelByName(modelId: number): Promise<AiModel | null> {
    return this.prisma.aiModel.findUnique({
      where: { id: modelId },
    });
  }
}
