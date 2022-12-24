import { PrismaClient, Prisma, User } from '@prisma/client';
import { container, injectable } from 'tsyringe';

@injectable()
export class UserRepository {
  private readonly _client: PrismaClient;

  constructor() {
    this._client = container.resolve<PrismaClient>('PrismaClient');
  }

  async create(obj: Prisma.UserCreateInput): Promise<User> {
    const user = await this._client.user.create({
      data: {
        ...obj,
      },
    });
    return user;
  }
}
