import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './Tasks/task.module';
import { UserModule } from './Users/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtMiddleware } from './common/jwtMiddleware';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    TaskModule,
    UserModule,
    CommentModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}