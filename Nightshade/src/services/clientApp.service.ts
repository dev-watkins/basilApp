import { randomBytes } from 'crypto';
import { injectable, container } from 'tsyringe';
import { hash, compare } from 'bcrypt';
import { ClientAppRepository } from '../repositories';
import { ClientAppNotFound } from '../framework';

@injectable()
export class ClientAppService {
  private readonly _repository: ClientAppRepository;

  constructor() {
    this._repository = container.resolve<ClientAppRepository>(
      'ClientAppRepository'
    );
  }

  async registerApp(name: string): Promise<string> {
    const secret = randomBytes(32).toString('hex');
    const hashedSecret = await hash(secret, 10);

    await this._repository.create({ name, clientSecret: hashedSecret });
    return secret;
  }

  async verifySecret(clientId: string, secret: string): Promise<boolean> {
    const app = await this._repository.get(clientId);
    if (!app) throw new ClientAppNotFound();

    return await compare(secret, app.clientSecret);
  }
}
