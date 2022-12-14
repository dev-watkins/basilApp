import { User } from '@prisma/client';
import { container } from 'tsyringe';
import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';
import { UserService } from '../../services';
import { RegisterInput } from '../../types';
import { requestValidator, RegisterRequest } from '../../requestSchemas';
import { resolverWrapper } from '../../helpers/resolverWrapper';
import { UnauthorizedClient } from '../../framework';

export const userMutationResolver = {
  register: async (
    _: any,
    args: RegisterInput,
    { req }: ExpressContextFunctionArgument
  ): Promise<User> => {
    return await resolverWrapper(async () => {
      const { client_id, client_secret } = req.headers;
      console.log(req.headers);
      if (!client_id || !client_secret) {
        throw new UnauthorizedClient();
      }

      requestValidator(RegisterRequest, args);
      const userService = container.resolve<UserService>('UserService');
      const user = await userService.register(args);

      return user;
    });
  },
};
