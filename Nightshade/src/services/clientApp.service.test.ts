import 'reflect-metadata';
import { container } from 'tsyringe';
import { ClientAppRepository } from '../repositories';
import { ClientAppService } from '../services';

describe('tests for client app service', () => {
  it('should call repository.create and return a secret', async () => {
    container.register('PrismaClient', { useValue: jest.fn() });
    const mockRepo = new ClientAppRepository();
    mockRepo.create = jest.fn();
    container.register('ClientAppRepository', { useValue: mockRepo });

    const service = new ClientAppService();

    const secret = await service.registerApp('test');

    expect(secret).toBeDefined();
    expect(secret.length).toBe(64);
    expect(mockRepo.create).toBeCalledTimes(1);
  });
});
