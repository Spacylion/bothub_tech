import { UsersService } from '../database/services/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UsersService) {}

  async getUserBalance(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { balance: user.balance };
  }

  async getUserId(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { id: user.id };
  }

  async updateUserBalance(userId: number, amount: number) {
    if (amount < 0) {
      throw new HttpException(
        'Amount must be positive',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userService.updateUserBalance(userId, amount);
    return { message: 'Balance updated successfully.' };
  }
}
