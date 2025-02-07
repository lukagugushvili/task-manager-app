import { Field, InputType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';
import { PartialType } from '@nestjs/mapped-types';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field()
  id: number;
}
