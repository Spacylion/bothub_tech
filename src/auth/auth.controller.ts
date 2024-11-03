// auth/auth.controller.ts
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован.',
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно аутентифицирован.',
  })
  @ApiResponse({
    status: 401,
    description: 'Неправильное имя пользователя или пароль.',
  })
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const token = await this.authService.validateUser(loginDto);
    if (!token)
      throw new UnauthorizedException(
        'Неправильное имя пользователя или пароль',
      );
    return { token };
  }
}
