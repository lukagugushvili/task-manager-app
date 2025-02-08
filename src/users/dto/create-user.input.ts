import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRoles } from 'src/enums/user-role';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field(() => UserRoles, { nullable: true, defaultValue: UserRoles.USER })
  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles;
}
