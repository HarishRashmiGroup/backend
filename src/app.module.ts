import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './Tasks/task.module';
import { UserModule } from './Users/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    TaskModule,
    UserModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}