import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { ClientAppRepository } from '../repositories';
import { ClientAppService } from '../services';
import prisma from './client';

const seed = async (): Promise<void> => {
  container.register<PrismaClient>('PrismaClient', {
    useValue: prisma,
  });
  container.register<ClientAppRepository>('ClientAppRepository', {
    useValue: new ClientAppRepository(),
  });
  const service = new ClientAppService();
  const secret = await service.registerApp('Basil');
  console.log(secret);
};

seed().catch((err) => console.log(err));
