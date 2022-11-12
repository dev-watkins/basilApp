import { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';

export const userResolver = {
  users: () => {
    const client = container.resolve<PrismaClient>('PrismaClient');
    return client.user.findMany();
  },
  hello: (parent: any, args: any, context: any) => context.hi,
};
