import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findUserByUsername(username);
    if (existingUser) {
      throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST);
    }

    await this.validatePassword(password);
    const hashedPassword = await bcrypt.hash(password, 5);
    return this.userRepository.createUser(username, hashedPassword);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findUserByUsername(username);
    if (user && (await compare(password, user.password))) {
      return user;
    }
    return null;
  }

  private async validatePassword(password: string) {
    const minLength = 6;
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      throw new HttpException(
        'Password must be at least 6 characters long',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!specialCharacterRegex.test(password)) {
      throw new HttpException(
        'Password must contain at least one special character',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUserById(userId: number): Promise<User> {
    return this.userRepository.findUserById(userId);
  }

  async updateUserModel(userId: number, modelId: number | null): Promise<void> {
    await this.userRepository.updateUserModel(userId, modelId);
  }

  async updateUserBalance(userId: number, newBalance: number) {
    return this.userRepository.updateUserBalance(userId, newBalance);
  }
}
