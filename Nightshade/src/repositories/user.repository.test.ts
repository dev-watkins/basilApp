import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './user.repository';
import { VerificationService, MailService } from '../services';

describe('tests for user repository', () => {
  it('should call client create', async () => {
    const prisma = new PrismaClient();
    prisma.user.create = jest.fn();
    container.register<PrismaClient>('PrismaClient', {
      useValue: prisma,
    });
    container.register<MailService>('MailService', {
      useValue: new MailService(),
    });
    container.register<VerificationService>('VerificationService', {
      useValue: new VerificationService(),
    });

    const repository = new UserRepository();

    await repository.create({
      email: 'test@test.com',
      name: 'test user',
      phoneNumber: '9189181234',
    });

    expect(prisma.user.create).toBeCalled();
  });
});
