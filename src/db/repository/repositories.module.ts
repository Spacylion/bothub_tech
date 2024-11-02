import { Module } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { UserRepository } from './user.repository';
import { TokenRepository } from './token.repository';
import { AiModelRepository } from './ai_model.repository';
import { GenerationRepository } from './generation.repository';

@Module({
  providers: [
    PrismaService,
    UserRepository,
    TokenRepository,
    AiModelRepository,
    GenerationRepository,
  ],
  exports: [
    UserRepository,
    TokenRepository,
    AiModelRepository,
    GenerationRepository,
  ],
})
export class RepositoriesModule {}
