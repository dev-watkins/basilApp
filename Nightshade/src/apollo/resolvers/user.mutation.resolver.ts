import { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';

export const userMutationResolver = {
  register: (_: any, args: any) => {
    const { email, name, phoneNumber } = args;
  },
};
