import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';

export const GetUser = createParamDecorator<UserEntity>(
  (_data, context: ExecutionContext): UserEntity => {
    const req = context.switchToHttp().getRequest();

    return req.user;
  },
);
