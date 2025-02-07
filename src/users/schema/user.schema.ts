import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRoles } from 'src/enums/user-role';

@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => UserRoles)
  role: UserRoles;

  password: string;
}
