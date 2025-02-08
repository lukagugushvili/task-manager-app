import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRoles } from 'src/enums/user-role';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Create a new user with hashed password
  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { email, password } = createUserInput;
    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) throw new BadRequestException('User already exists');

      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      if (!hashedPassword) {
        throw new BadRequestException(
          'Something bad happened with the password',
        );
      }

      const newUser = await this.userModel.create({
        ...createUserInput,
        role: UserRoles.USER,
        password: hashedPassword,
      });
      await newUser.save();

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new BadRequestException('Could not create user:', error.message);
    }
  }

  // Get all users
  async findAllUser(): Promise<User[]> {
    const user = await this.userModel.find();

    if (!user || user.length === 0) {
      throw new NotFoundException('Could not fetch users');
    }

    return user;
  }

  // Get a single user by their id
  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('Could not find user');

    return user;
  }

  // Update a users information
  async updateUser(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    try {
      const updateData: Partial<UpdateUserInput> = { ...updateUserInput };

      if (updateUserInput.password) {
        const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

        if (isNaN(saltRounds) || saltRounds <= 0) {
          throw new BadRequestException('Invalid salt rounds');
        }

        updateData.password = await bcrypt.hash(
          updateUserInput.password,
          saltRounds,
        );
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserInput,
        { new: true },
      );

      if (!updatedUser) throw new NotFoundException('Could not find user');

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw new BadRequestException('Could not update user:', error.message);
    }
  }

  // Remove a user from the list of users
  async removeUser(id: string): Promise<User> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) throw new NotFoundException('Could not find user');

      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw new BadRequestException('Could not delete user:', error.message);
    }
  }

  // Implement logic to change user role
  async changeUserRole(id: string, newRole: UserRoles) {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User not found');

    user.role = newRole;

    await user.save();

    return user;
  }
}
