import { Module } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { TokenRepository } from './token.repository';
import { AiModelRepository } from './ai_model.repository';
import { GenerationRepository } from './generation.repository';

@Module({
  providers: [
    PrismaService,
    TokenRepository,
    AiModelRepository,
    GenerationRepository,
  ],
  exports: [TokenRepository, AiModelRepository, GenerationRepository],
})
export class RepositoriesModule {}
