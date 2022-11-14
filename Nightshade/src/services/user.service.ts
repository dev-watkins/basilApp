import { User } from '@prisma/client';
import { container, injectable } from 'tsyringe';
import { UserRepository } from '../repositories';
import { RegisterInput } from '../types';

@injectable()
export class UserService {
  private readonly _repository: UserRepository;

  constructor() {
    this._repository = container.resolve<UserRepository>('UserRepository');
  }

  async register(registration: RegisterInput): Promise<User> {
    const user = await this._repository.create(registration);
    console.log(user.verificationTokens);
    return user;
  }
}
