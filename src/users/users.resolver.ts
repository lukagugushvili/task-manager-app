import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './schema/user.schema';
import { UserRoles } from 'src/enums/user-role';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.createUser(createUserInput);
  }

  @Query(() => [User])
  async findAllUser(): Promise<User[]> {
    return this.usersService.findAllUser();
  }

  @Query(() => User, { nullable: true })
  async findUserById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User | null> {
    return this.usersService.findUserById(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const { id } = updateUserInput;
    return this.usersService.updateUser(id, updateUserInput);
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.removeUser(id);
  }

  @Mutation(() => User)
  async changeUserRole(
    @Args('id', { type: () => ID }) id: string,
    @Args('newRole', { type: () => UserRoles }) newRole: UserRoles,
  ) {
    return this.usersService.changeUserRole(id, newRole);
  }
}
