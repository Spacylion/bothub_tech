import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/guards/roles.guards';
import { UserRole } from '@prisma/client';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user balance' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved balance.',
    schema: {
      type: 'object',
      properties: {
        balance: { type: 'number' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('get-balance')
  async getBalance(@Req() req: any) {
    const userId = req.user.id;
    return await this.profileService.getUserBalance(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user ID.',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('get-id')
  async getId(@Req() req: any) {
    const userId = req.user.id;
    return { userId };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user balance (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated balance.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid amount.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, only admins can update the balance.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        amount: { type: 'number' },
      },
      required: ['userId', 'amount'],
    },
  })
  @Post('update-balance')
  async updateBalance(
    @Body() { userId, amount }: { userId: number; amount: number },
  ) {
    return await this.profileService.updateUserBalance(userId, amount);
  }
}
