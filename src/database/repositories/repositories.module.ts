import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TokenRepository } from './token.repository';
import { AiModelRepository } from './aiModel.repository';

@Module({
  providers: [PrismaService, TokenRepository, AiModelRepository],
  exports: [TokenRepository, AiModelRepository],
})
export class RepositoriesModule {}
