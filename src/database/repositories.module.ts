import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { TokenRepository } from '../repositories/token.repository';
import { AiModelRepository } from '../repositories/ai_model.repository';
import { GenerationRepository } from '../repositories/generation.repository';

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
