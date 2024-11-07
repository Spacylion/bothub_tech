import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AiModelService } from './aiModel.service';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { UsersService } from '../database/services/user.service';
import { User } from '@prisma/client';

class SwitchModelDto {
  @ApiProperty({
    description:
      'The ID of the model to switch to (e.g., 1 for gpt-3.5, 2 for gpt-4, 3 for mistral).',
  })
  modelId!: number | null;
}

class PostRequestDto {
  @ApiProperty({
    description: 'The prompt to send to the AI model.',
  })
  prompt!: string;
}

@ApiTags('ai-model')
@Controller('ai-model')
export class AiModelController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly aiModelService: AiModelService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('switch')
  @ApiOperation({ summary: 'Choose AI model' })
  @ApiResponse({
    status: 200,
    description: 'Successfully switched model.',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  async switchModel(@Req() req: any, @Body() switchModelDto: SwitchModelDto) {
    const { modelId } = switchModelDto;
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpException(
        'User ID cannot be undefined or null',
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.logger.log(`User ${userId} is switching to model ID ${modelId}`);
    return await this.aiModelService.switchModel(userId, modelId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request')
  @ApiOperation({ summary: 'Send a prompt to the selected AI model' })
  @ApiResponse({
    status: 200,
    description: 'Prompt successfully processed and balance updated.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  async processRequest(
    @Req() req: any,
    @Body() postRequestDto: PostRequestDto,
  ) {
    const { prompt } = postRequestDto;
    const userId = req.user.id;

    const user: User = await this.usersService.findUserById(userId);

    // Проверяем, что selectedModelId не равен null
    if (user.selectedModelId === null) {
      throw new HttpException('No model selected', HttpStatus.BAD_REQUEST);
    }

    const model = await this.aiModelService.findAiModelById(
      user.selectedModelId,
    );

    if (!model) {
      throw new HttpException('AI model not found', HttpStatus.NOT_FOUND);
    }

    if (user.balance < model.tokenCost) {
      throw new HttpException('Insufficient balance', HttpStatus.FORBIDDEN);
    }

    const result = await this.aiModelService.processPrompt(model, prompt);

    await this.usersService.updateUserBalance(
      userId,
      user.balance - model.tokenCost,
    );

    this.logger.log(
      `User ${userId} has been charged for the prompt to model ${model.name}`,
    );

    return { message: 'Request processed successfully', result };
  }
}