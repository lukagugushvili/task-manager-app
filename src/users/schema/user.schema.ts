import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRoles } from 'src/enums/user-role';
import { Task } from 'src/tasks/schema/task.schema';

@Schema({ timestamps: true })
@ObjectType()
export class User extends Document {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ enum: UserRoles, default: UserRoles.USER })
  @Field(() => UserRoles)
  role: UserRoles;

  @Prop({ required: true })
  password: string;

  @Field(() => [Task])
  @Prop([{ type: Types.ObjectId, ref: 'Task' }])
  task: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
