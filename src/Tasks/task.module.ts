import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { User } from 'src/Users/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [MikroOrmModule.forFeature([Task, User]),ScheduleModule.forRoot()],
  providers: [TaskService, EmailService],
  controllers: [TaskController],
})
export class TaskModule {}
