import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Task } from "../Tasks/entities/task.entity";
import { User } from "../Users/entities/user.entity";
import { EmailModule } from "../email/email.module";
import { Comment } from "./entities/comment.entity";

@Module({
    imports: [MikroOrmModule.forFeature([Task, User, Comment]), EmailModule],
    controllers: [CommentController],
    providers: [CommentService]

})
export class CommentModule { }