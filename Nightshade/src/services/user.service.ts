import { User } from '@prisma/client';
import { container, injectable } from 'tsyringe';
import { UserRepository } from '../repositories';
import { RegisterInput } from '../types';
import { VerificationService } from './verification.service';

@injectable()
export class UserService {
  private readonly _repository: UserRepository;
  private readonly _verificationService: VerificationService;

  constructor() {
    this._repository = container.resolve<UserRepository>('UserRepository');
    this._verificationService = container.resolve<VerificationService>(
      'VerificationService'
    );
  }

  async register(registration: RegisterInput): Promise<User> {
    const user = await this._repository.create(registration);
    await this._verificationService.sendVerificationEmail(
      user.verificationTokens[0].token,
      user.email
    );
    return user;
  }
}
