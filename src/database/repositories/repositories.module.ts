import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiModelRepository } from './aiModel.repository';

@Module({
  providers: [PrismaService, AiModelRepository],
  exports: [AiModelRepository],
})
export class RepositoriesModule {}
