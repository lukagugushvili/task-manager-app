import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/enums/task-status';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => TaskStatus, { defaultValue: TaskStatus.PENDING, nullable: true })
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Field(() => ID)
  @IsNotEmpty()
  user: string;
}
