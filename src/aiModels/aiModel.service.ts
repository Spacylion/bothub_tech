import { Injectable } from '@nestjs/common';
import { UsersService } from '../database/services/user.service';

@Injectable()
export class AiModelService {
  constructor(private readonly usersService: UsersService) {}
}
