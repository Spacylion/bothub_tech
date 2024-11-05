import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AiModelService } from './aiModel.service';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { PlanCosts } from '../shared/enums';

@ApiTags('ai-model')
@Controller('ai-model')
export class AiModelController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly aiModelService: AiModelService) {}

  @UseGuards(JwtAuthGuard)
  @Get('costs')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved plan costs.',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  getPlanCosts() {
    this.logger.log('Retrieving plan costs');
    return PlanCosts;
  }
}
