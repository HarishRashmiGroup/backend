import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { User } from "src/common/decorators/user.decorator";

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
    ) { }
    @Auth()
    @Post()
    newComment(@User() userId: number, @Body() body: { description: string; taskId: number }) {
        return this.commentService.createTask(userId, body.description, body.taskId);
    }

    @Auth()
    @Get(':taskId')
    getComments(@Param('taskId') taskId: number) {
        return this.commentService.getComments(taskId);
    }
}