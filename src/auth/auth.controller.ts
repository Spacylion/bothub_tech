import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ATTEMPTS_LIMIT, TTL_RATE_LIMIT_IN_MSEC } from '../shared/constants';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

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
    return this.handleAuthOperation(async () => {
      return await this.authService.register(username, password);
    });
  }

  @Throttle({ default: { limit: ATTEMPTS_LIMIT, ttl: TTL_RATE_LIMIT_IN_MSEC } })
  @ApiOperation({
    summary: 'User login',
    description: `Limits: ${ATTEMPTS_LIMIT} requests per ${TTL_RATE_LIMIT_IN_MSEC / 1000} seconds`,
  })
  @Post('login')
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
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({
    status: 429,
    description: 'Too many requests, please try again later',
  })
  async login(
    @Body() { username, password }: { username: string; password: string },
  ) {
    this.logger.debug('Login attempt:', { username });
    return this.handleAuthOperation(async () => {
      const token = await this.authService.login(username, password);
      if (!token) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return token;
    });
  }

  private async handleAuthOperation(operation: () => Promise<any>) {
    try {
      return await operation();
    } catch (error) {
      this.logger.error('Error during authentication operation', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
