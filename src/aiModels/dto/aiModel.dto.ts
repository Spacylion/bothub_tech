import { ApiProperty } from '@nestjs/swagger';
import { Model } from '../../shared/enums';
import { IsEnum, IsOptional } from 'class-validator';

export class SwitchModelDto {
  @ApiProperty({
    description: 'The name of the AI model to switch to.',
    enum: Model,
    enumName: 'Model',
    required: false,
  })
  @IsEnum(Model)
  @IsOptional()
  modelName?: Model | null;
}

export class PostRequestDto {
  @ApiProperty({
    description: 'The prompt to send to the AI model.',
  })
  prompt!: string;
}