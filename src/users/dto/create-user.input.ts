import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRoles } from 'src/enums/user-role';
import { Task } from 'src/tasks/schema/task.schema';

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

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  task?: Task[];
}
