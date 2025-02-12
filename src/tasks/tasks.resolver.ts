import { TasksService } from './tasks.service';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Task } from './schema/task.schema';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskInput);
  }

  @Query(() => [Task])
  async findAllTasks(): Promise<Task[]> {
    return this.tasksService.findAllTasks();
  }

  @Query(() => Task, { nullable: true })
  async findTaskById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Task | null> {
    return this.tasksService.findTaskById(id);
  }

  @Mutation(() => Task)
  async updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    const { id } = updateTaskInput;
    return this.tasksService.updateTask(id, updateTaskInput);
  }

  @Mutation(() => Task)
  async deleteTask(@Args('id', { type: () => ID }) id: string): Promise<Task> {
    return this.tasksService.deleteTask(id);
  }
}
