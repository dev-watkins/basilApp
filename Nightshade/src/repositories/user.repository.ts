import { PrismaClient, Prisma, User, VerificationToken } from '@prisma/client';
import { container, injectable } from 'tsyringe';

@injectable()
export class UserRepository {
  private readonly _client: PrismaClient;

  constructor() {
    this._client = container.resolve<PrismaClient>('PrismaClient');
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
              token: Math.floor(100000 + Math.random() * 900000).toString(),
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
