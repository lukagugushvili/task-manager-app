import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schema/task.schema';
import { Model, Types } from 'mongoose';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { TaskStatus } from 'src/enums/task-status';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  // Create a new Task and add it to the list of tasks
  async createTask(createTaskInput: CreateTaskInput): Promise<Task> {
    try {
      const userId = new Types.ObjectId(createTaskInput.user);

      const newTask = new this.taskModel({
        ...createTaskInput,
        user: userId,
      });

      await newTask.save();

      return newTask;
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

      if (
        updateTaskInput.status &&
        updateTaskInput.status !== TaskStatus.COMPLETED
      ) {
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
