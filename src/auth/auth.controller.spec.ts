import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: Partial<JwtService>;

  let res: Partial<Response>;

  const mockUser = {
    id: 1,
    username: 'newuser',
    password: 'password123!',
    role: UserRole.USER,
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    planId: null,
  };

  const mockLoginUser = { username: 'testuser', password: 'password123' };
  const mockResponse = { access_token: 'mocked-jwt-token' };

  beforeEach(async () => {
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      clearCookie: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue(mockResponse.access_token),
    };

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
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

      const result = await authController.register(mockUser);
      expect(result).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(
        mockUser.username,
        mockUser.password,
      );
    });

    it('should throw an error if username is taken', async () => {
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
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

      await authController.login(mockLoginUser, res as Response);
      expect(res.cookie).toHaveBeenCalledWith(
        'jwt',
        mockResponse.access_token,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Successfully logged in',
        access_token: mockResponse.access_token,
      });
    });

    it('should throw an error for invalid credentials', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(
          new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
        );

      await expect(
        authController.login(mockLoginUser, res as Response),
      ).rejects.toThrow(HttpException);
      await expect(
        authController.login(mockLoginUser, res as Response),
      ).rejects.toThrowError('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should log out successfully', async () => {
      await authController.logout({}, res as Response);
      expect(res.clearCookie).toHaveBeenCalledWith('jwt');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Successfully logged out',
      });
    });
  });
});