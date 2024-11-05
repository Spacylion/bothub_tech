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

class SwitchModelDto {
  @ApiProperty({
    description:
      'The ID of the model to switch to (e.g., 1 for gpt-3.5, 2 for gpt-4, 3 for mistral).',
  })
  modelId!: number | null;
}

@ApiTags('ai-model')
@Controller('ai-model')
export class AiModelController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly aiModelService: AiModelService) {}

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
}