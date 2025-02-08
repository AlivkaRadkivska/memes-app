import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';

export const GetUser = createParamDecorator<UserEntity | undefined>(
  (_data, context: ExecutionContext): UserEntity | undefined => {
    const req = context.switchToHttp().getRequest();

    return req.user || undefined;
  },
);
