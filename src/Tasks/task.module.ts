import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { User } from 'src/Users/entities/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [MikroOrmModule.forFeature([Task, User]),ScheduleModule.forRoot(), EmailModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
