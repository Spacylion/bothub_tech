import { ApiProperty } from '@nestjs/swagger';

export class SwitchModelDto {
  @ApiProperty({
    description:
      'The ID of the model to switch to (e.g., 1 for gpt-3.5, 2 for gpt-4, 3 for mistral).',
  })
  modelId!: number | null;
}

export class PostRequestDto {
  @ApiProperty({
    description: 'The prompt to send to the AI model.',
  })
  prompt!: string;
}