import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AiModelRepository } from '../database/repositories/aiModel.repository';
import { UsersService } from '../database/services/user.service';
import { AiModel } from '@prisma/client';

@Injectable()
export class AiModelService {
  constructor(
    private readonly usersService: UsersService,
    private readonly aiModelRepository: AiModelRepository,
  ) {}

  async switchModel(
    userId: number,
    modelName: string | null,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (modelName === null) {
      await this.usersService.updateUserModel(userId, null);
      return { message: 'Successfully removed model selection' };
    }
    const model = await this.aiModelRepository.findAiModelByName(modelName);
    if (!model) {
      throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
    }

    if (user.balance < model.tokenCost) {
      throw new HttpException('Insufficient balance', HttpStatus.FORBIDDEN);
    }
    await this.usersService.updateUserModel(userId, model.id);
    return { message: `Successfully switched to model ${model.name}` };
  }

  async processPrompt(model: AiModel, prompt: string): Promise<string> {
    return `Response to "${prompt}" from model ${model.name}`;
  }

  async findAiModelById(modelId: number): Promise<AiModel | null> {
    return this.aiModelRepository.findAiModelById(modelId);
  }
}
