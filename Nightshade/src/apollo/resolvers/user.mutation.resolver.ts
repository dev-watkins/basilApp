import { User } from '@prisma/client';
import { container } from 'tsyringe';
import { UserService } from '../../services';
import { RegisterInput } from '../../types';
import { requestValidator, RegisterRequest } from '../../requestSchemas';

export const userMutationResolver = {
  register: async (_: any, args: RegisterInput): Promise<User> => {
    let user;
    try {
      requestValidator(RegisterRequest, args);
      const userService = container.resolve<UserService>('UserService');
      user = await userService.register(args);
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
    return user;
  },
};
