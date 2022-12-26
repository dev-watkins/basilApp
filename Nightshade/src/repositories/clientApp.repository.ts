import { PrismaClient, Prisma, App } from '@prisma/client';
import { container, injectable } from 'tsyringe';

@injectable()
export class ClientAppRepository {
  private readonly _client: PrismaClient;

  constructor() {
    this._client = container.resolve<PrismaClient>('PrismaClient');
  }

  async get(clientId: string): Promise<App | null> {
    return await this._client.app.findUnique({ where: { id: clientId } });
  }

  async create(obj: Prisma.AppCreateInput): Promise<App> {
    const app = await this._client.app.create({
      data: {
        ...obj,
      },
    });
    return app;
  }
}
