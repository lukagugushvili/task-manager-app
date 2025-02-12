import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/enums/user-role';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
