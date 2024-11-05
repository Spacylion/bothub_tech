import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = { username: 'testuser', password: 'password123' };
      const expectedResponse = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword123',
        role: UserRole.USER,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        planId: null, // Add this line
      };
      jest.spyOn(authService, 'register').mockResolvedValue(expectedResponse);

      const result = await authController.register(mockUser);
      expect(result).toEqual(expectedResponse);
      expect(authService.register).toHaveBeenCalledWith(
        mockUser.username,
        mockUser.password,
      );
    });

    it('should throw a 400 error if username is taken', async () => {
      const mockUser = { username: 'existingUser', password: 'password123' };
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(
          new HttpException('Username already taken', HttpStatus.BAD_REQUEST),
        );

      await expect(authController.register(mockUser)).rejects.toThrow(
        HttpException,
      );
      await expect(authController.register(mockUser)).rejects.toThrowError(
        'Username already taken',
      );
    });

    it('should throw a 400 error if password is invalid', async () => {
      const mockUser = { username: 'newuser', password: 'short' };
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(
          new HttpException(
            'Password does not meet requirements',
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(authController.register(mockUser)).rejects.toThrow(
        HttpException,
      );
      await expect(authController.register(mockUser)).rejects.toThrowError(
        'Password does not meet requirements',
      );
    });
  });

  describe('login', () => {
    it('should log in successfully', async () => {
      const mockUser = { username: 'testuser', password: 'password123' };
      const token = 'mocked-jwt-token';
      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ access_token: token });

      const result = await authController.login(mockUser);
      expect(result).toEqual({ access_token: token });
      expect(authService.login).toHaveBeenCalledWith(
        mockUser.username,
        mockUser.password,
      );
    });

    it('should throw a 401 error for invalid credentials', async () => {
      const mockUser = { username: 'testuser', password: 'wrongpassword' };
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(
          new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
        );

      await expect(authController.login(mockUser)).rejects.toThrow(
        HttpException,
      );
      await expect(authController.login(mockUser)).rejects.toThrowError(
        'Invalid credentials',
      );
    });

    it('should handle unexpected errors in login method', async () => {
      const mockUser = { username: 'testuser', password: 'password123' };
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(authController.login(mockUser)).rejects.toThrow(
        HttpException,
      );
      await expect(authController.login(mockUser)).rejects.toThrowError(
        'Internal server error',
      );
    });
  });
});