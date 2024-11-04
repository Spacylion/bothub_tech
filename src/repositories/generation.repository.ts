import { Generation } from '@prisma/client';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";

export interface IGenerationRepository {
  createGeneration(
    data: Omit<Generation, 'id' | 'createdAt'>,
  ): Promise<Generation>;

  findGenerationById(id: number): Promise<Generation | null>;

  findGenerationsByUserId(userId: number): Promise<Generation[]>;

  updateGeneration(id: number, data: Partial<Generation>): Promise<Generation>;

  deleteGeneration(id: number): Promise<void>;
}

@Injectable()
export class GenerationRepository implements IGenerationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createGeneration(
    data: Omit<Generation, 'id' | 'createdAt'>,
  ): Promise<Generation> {
    return this.prisma.generation.create({ data });
  }

  async findGenerationById(id: number): Promise<Generation | null> {
    return this.prisma.generation.findUnique({ where: { id } });
  }

  async findGenerationsByUserId(userId: number): Promise<Generation[]> {
    return this.prisma.generation.findMany({ where: { userId } });
  }

  async updateGeneration(
    id: number,
    data: Partial<Generation>,
  ): Promise<Generation> {
    return this.prisma.generation.update({ where: { id }, data });
  }

  async deleteGeneration(id: number): Promise<void> {
    await this.prisma.generation.delete({ where: { id } });
  }
}