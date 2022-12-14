import { randomBytes } from 'crypto';
import prisma from './client';

const seed = async (): Promise<void> => {
  await prisma.app.create({
    data: {
      name: 'basil',
      clientSecret: (await randomBytes(32)).toString('hex'),
    },
  });
};

seed().catch((err) => console.log(err));
