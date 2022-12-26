import type { Request } from 'express';
import { container } from 'tsyringe';
import { UnauthorizedClient } from '../framework';
import { ClientAppService } from '../services';

export const authenticateClient = (req: Request) => async () => {
  const { client_id, client_secret } = req.headers;
  if (!client_id || !client_secret) {
    throw new UnauthorizedClient();
  }
  const clientAppService =
    container.resolve<ClientAppService>('ClientAppService');

  const verified = await clientAppService.verifySecret(
    client_id as string,
    client_secret as string
  );

  if (!verified) throw new UnauthorizedClient();
};
