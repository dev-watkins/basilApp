import { User, VerificationToken } from '@prisma/client';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { UserRepository } from '../repositories';
import { VerificationService } from '../services';
import { UserService } from './user.service';

describe('test for user service', () => {
  it('should call create method on user repository and sendVerificationEmail', async () => {
    container.register('PrismaClient', { useValue: jest.fn() });
    container.register('MailService', { useValue: jest.fn() });

    const veriService = new VerificationService();
    veriService.sendVerificationEmail = jest.fn();

    container.register<VerificationService>('VerificationService', {
      useValue: veriService,
    });

    const repo = new UserRepository();
    repo.create = jest.fn().mockImplementation(async () => {
      return (await Promise.resolve({
        email: 'test@test.com',
        verificationTokens: [{ token: '123456' }],
      })) as unknown as User & VerificationToken;
    });

    container.register<UserRepository>('UserRepository', {
      useValue: repo,
    });

    const userService = new UserService();

    await userService.register({
      email: 'test@test.com',
      name: 'test',
      phoneNumber: '918',
    });

    expect(repo.create).toBeCalled();
    expect(veriService.sendVerificationEmail).toBeCalled();
  });
});
