import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from '../db/repository/user.repository';
import { JwtService } from './guards/jwt.service';
import { CreateUserDto } from './dto/create-user.dto'; // Assuming you have a DTO defined

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const existingUser = await this.usersService.findUserByUsername(username); // Updated method name
    if (existingUser) {
      throw new ConflictException('Пользователь с таким именем уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.createUser(username, hashedPassword);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
