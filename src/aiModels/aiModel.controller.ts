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
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AiModelService } from './aiModel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../database/services/user.service';
import { User } from '@prisma/client';
import { PostRequestDto, SwitchModelDto } from './dto/aiModel.dto';
import { Model } from '../shared/enums';
import { BothubService } from '../bothub/bothub.service';

@ApiTags('ai-model')
@Controller('ai-model')
export class AiModelController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly aiModelService: AiModelService,
    private readonly usersService: UsersService,
    private readonly bothubService: BothubService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('switch')
  @ApiOperation({
    summary: 'Choose AI model',
    description: `Specify the model you want to switch to. Allowed values are: ${Object.values(Model).join(', ')}`,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully switched model.',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiBody({ type: SwitchModelDto })
  async switchModel(@Req() req: any, @Body() switchModelDto: SwitchModelDto) {
    const { modelName } = switchModelDto;
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(
        'User ID cannot be undefined or null',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const modelNameString = modelName ? modelName.toString() : null;
    this.logger.log(`User ${userId} is switching to model ${modelNameString}`);
    return await this.aiModelService.switchModel(userId, modelNameString);
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
    if (user.selectedModelId === null) {
      throw new HttpException('No model selected', HttpStatus.BAD_REQUEST);
    }
    const model = await this.aiModelService.findAiModelById(
      user.selectedModelId,
    );
    if (!model) {
      throw new HttpException('AI model not found', HttpStatus.NOT_FOUND);
    }
    this.logger.log(`This model set to: ${model.name}`);

    if (user.balance < model.tokenCost) {
      throw new HttpException('Insufficient balance', HttpStatus.FORBIDDEN);
    }
    const result = await this.bothubService.sendMessageToBothub(
      model.name,
      prompt,
    );
    await this.usersService.updateUserBalance(
      userId,
      user.balance - model.tokenCost,
    );

    return { message: 'Request processed successfully', result };
  }
}
