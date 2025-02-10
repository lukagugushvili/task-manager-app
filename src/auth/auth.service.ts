import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterResponse } from './auth-response/register-response';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { LoginResponse } from './auth-response/login-response';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Implement authentication register here
  async register(registerInput: CreateUserInput): Promise<RegisterResponse> {
    try {
      const user = await this.userService.createUser(registerInput);

      return { message: `User registration successful`, user };
    } catch (error) {
      console.error(`Failed to register user: ${error.message}`);
      throw new BadRequestException(
        `Failed to register user: ${error.message}`,
      );
    }
  }

  // Implement authentication login here
  async login(loginInput: LoginInput): Promise<LoginResponse> {
    const { email, password } = loginInput;
    try {
      const user = await this.userService.findFieldsForAuth(email);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const jwtPayLoad = { email, role: user.role, userId: user.id };
      const access_token = this.jwtService.sign(jwtPayLoad);

      return { message: 'User logged in successfully', access_token };
    } catch (error) {
      console.error(`Failed to login user: ${error.message}`);
      throw new BadRequestException(`Failed to login user: ${error.message}`);
    }
  }
}
