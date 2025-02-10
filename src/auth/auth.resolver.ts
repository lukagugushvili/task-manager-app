import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/schema/user.schema';
import { RegisterResponse } from './auth-response/register-response';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { LoginResponse } from './auth-response/login-response';
import { LoginInput } from './dto/login.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('input') registerInput: CreateUserInput,
  ): Promise<RegisterResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginResponse> {
    return this.authService.login(loginInput);
  }
}
