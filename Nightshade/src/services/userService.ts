import { User } from '@prisma/client';
import { container } from 'tsyringe';
import { UserRepository } from '../repositories';
import { RegisterInput } from '../types';

export class UserService {
  private readonly _repository: UserRepository;

  constructor() {
    this._repository = container.resolve<UserRepository>('UserRepository');
  }

  async register(registration: RegisterInput): Promise<User> {
    const user = await this._repository.create(registration);
    return user;
  }
}
