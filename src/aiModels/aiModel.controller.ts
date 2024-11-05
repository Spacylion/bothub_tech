import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AiModelService } from './aiModel.service';

@ApiTags('ai-model')
@Controller('ai-model')
export class AiModelController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly aiModelService: AiModelService) {}
}
