import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskStatus } from './entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(
    @Body() body: { description: string; dueDate: Date; userId?: number,newUser?:{name: string, email: string}, status?: TaskStatus },
  ) {
    return this.taskService.createTask(body.description, body.dueDate,body.userId,body.newUser, body.status);
  }

  @Get()
  getAllTasks(@Query('month') month: number, @Query('year') year:number) {
    return this.taskService.getTasks(month, year);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: number,
    @Body() body: Partial<{ description: string; dueDate: Date; status: TaskStatus, assignedTo: number, newUserName: string, newUserEmail: string}>,
  ) {
    return this.taskService.updateTask(id, body);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }
}
