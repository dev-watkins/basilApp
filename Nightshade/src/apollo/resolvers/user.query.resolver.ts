import { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';

export const userQueryResolver = {
  users: () => {
    const client = container.resolve<PrismaClient>('PrismaClient');
    return client.user.findMany();
  },
};
