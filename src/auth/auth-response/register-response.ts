import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/schema/user.schema';

@ObjectType()
export class RegisterResponse {
  @Field()
  message: string;

  @Field(() => User)
  user: User;
}
