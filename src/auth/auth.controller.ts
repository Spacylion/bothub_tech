import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ATTEMPTS_LIMIT, TTL_RATE_LIMIT_IN_MSEC } from '../shared/constants';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Username already taken.' })
  @ApiResponse({
    status: 400,
    description: 'Password does not meet requirements.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })
  @Post('register')
  async register(
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.authService.register(username, password);
  }

  @Throttle({ default: { limit: ATTEMPTS_LIMIT, ttl: TTL_RATE_LIMIT_IN_MSEC } })
  @ApiOperation({
    summary: 'User login',
    description: `Limits: ${ATTEMPTS_LIMIT} requests per ${TTL_RATE_LIMIT_IN_MSEC / 1000} seconds`,
  })
  @Post('login')
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({
    status: 429,
    description: 'Too many requests, please try again later',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })
  async login(
    @Body() { username, password }: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(username, password);
    if (!access_token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    this.logger.debug('Token generated:', access_token);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(200).send({
      message: 'Successfully logged in',
      access_token: access_token,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    res.status(200).send({
      message: 'Successfully logged out',
    });
  }
}
