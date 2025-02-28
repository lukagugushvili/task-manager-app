import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schema/task.schema';
import { Model } from 'mongoose';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { TaskStatus } from 'src/enums/task-status';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly userService: UsersService,
  ) {}

  // Create a new Task and add it to the list of tasks
  async createTask(createTaskInput: CreateTaskInput): Promise<Task> {
    try {
      const user = await this.userService.findUserById(createTaskInput.user);

      if (!user) throw new NotFoundException(`User with ID ${user} not found`);

      const post = await this.taskModel.create(createTaskInput);

      await this.userService.addTaskToUser(user.id, post.id);

      return await post.populate('user');
    } catch (error) {
      console.error('Error creating task:', error.message);
      throw new BadRequestException('Could not create task:', error.message);
    }
  }

  // Get all Tasks
  async findAllTasks(): Promise<Task[]> {
    const tasks = await this.taskModel.find();

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('no tasks found');
    }

    return tasks;
  }

  // Get a single Task by their ID
  async findTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id);

    if (!task) throw new NotFoundException('Could not find task');

    return task;
  }

  // Update a Tasks information
  async updateTask(
    id: string,
    updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    try {
      const updateData: Partial<UpdateTaskInput> = { ...updateTaskInput };

      if (updateTaskInput.status && updateTaskInput.status !== 'COMPLETED') {
        updateData.status = updateTaskInput.status;
      }

      const updateTask = await this.taskModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        },
      );

      if (!updateTask) throw new NotFoundException('Could not find task');

      return updateTask;
    } catch (error) {
      console.error('Error updating task: ', error.message);
      throw new BadRequestException('Could not update task: ', error.message);
    }
  }

  // Delete a task from the list of tasks
  async deleteTask(id: string): Promise<Task> {
    try {
      const deletedTask = await this.taskModel.findByIdAndDelete(id);

      if (!deletedTask) throw new NotFoundException('Could not find task');

      return deletedTask;
    } catch (error) {
      console.error('Error deleting task:', error.message);
      throw new BadRequestException('Could not delete task:', error.message);
    }
  }
}
