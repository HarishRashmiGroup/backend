import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Task } from "src/Tasks/entities/task.entity";
import { User } from "src/Users/entities/user.entity";
import { EmailModule } from "src/email/email.module";
import { Comment } from "./entities/comment.entity";

@Module({
    imports: [MikroOrmModule.forFeature([Task, User, Comment]), EmailModule],
    controllers: [CommentController],
    providers: [CommentService]

})
export class CommentModule { }