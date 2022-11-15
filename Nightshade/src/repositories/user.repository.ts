import { PrismaClient, Prisma, User, VerificationToken } from '@prisma/client';
import { container, injectable } from 'tsyringe';
import { VerificationService } from '../services';

@injectable()
export class UserRepository {
  private readonly _client: PrismaClient;
  private readonly _verificationService: VerificationService;

  constructor() {
    this._client = container.resolve<PrismaClient>('PrismaClient');
    this._verificationService = container.resolve<VerificationService>(
      'VerificationService'
    );
  }

  async create(
    obj: Prisma.UserCreateInput
  ): Promise<User & { verificationTokens: VerificationToken[] }> {
    const user = await this._client.user.create({
      data: {
        ...obj,
        verificationTokens: {
          create: [
            {
              token: this._verificationService.createToken(),
            },
          ],
        },
      },
      include: {
        verificationTokens: true,
      },
    });
    return user;
  }
}
