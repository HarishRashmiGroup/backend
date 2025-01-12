import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskStatus } from './entities/task.entity';
import { Auth } from '../common/decorators/auth.decorator';
import { User } from '../common/decorators/user.decorator';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Auth()
  @Post()
  createTask(
    @Body() body: { description: string; dueDate: Date; userId?: number,newUser?:{name: string, email: string}, status?: TaskStatus },
    @User() createdById: number
  ) {
    return this.taskService.createTask(createdById, body.description, body.dueDate,body.userId,body.newUser, body.status);
  }

  @Auth()
  @Get()
  getAllTasks(@Query('month') month: number, @Query('year') year:number,@User()userId: number){
    return this.taskService.getTasks(month, year,userId);
  }

  @Auth()
  @Get('counts')
  getAllTasksCounts(@Query('month') month: number, @Query('year') year:number,@User()userId: number){
    return this.taskService.getTasksCounts(month, year,userId);
  }

  @Auth()
  @Get('day')
  getAllTasksForDay(@Query('date') date: string, @User()userId: number){
    return this.taskService.getAllTaskForDay(date,userId);
  }

  @Auth()
  @Patch(':id')
  updateTask(
    @Param('id') id: number,
    @Body() body: Partial<{ description: string; dueDate: Date; status: TaskStatus, assignedTo: number, newUserName: string, newUserEmail: string}>,
    @User() userId: number
  ) {
    return this.taskService.updateTask(userId, id, body);
  }

  @Auth()
  @Delete(':id')
  deleteTask(@Param('id') id: number, @User()userId: number) {
    return this.taskService.deleteTask(id,userId);
  }
}
