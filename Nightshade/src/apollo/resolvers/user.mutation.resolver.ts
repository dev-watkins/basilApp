import { User } from '@prisma/client';
import { container } from 'tsyringe';
import { UserService } from '../../services';
import { RegisterInput } from '../../types';
import { requestValidator, RegisterRequest } from '../../requestSchemas';

export const userMutationResolver = {
  register: async (_: any, args: RegisterInput): Promise<User> => {
    requestValidator(RegisterRequest, args);
    const userService = container.resolve<UserService>('UserService');
    const user = await userService.register(args);
    return user;
  },
};
