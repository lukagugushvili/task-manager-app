import { registerEnumType } from '@nestjs/graphql';

export enum UserRoles {
  USER = 'user',
  ADMIN = 'admin',
}

registerEnumType(UserRoles, {
  name: 'UserRoles',
});
