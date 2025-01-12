import { CommentService } from "./comment.service";
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    newComment(userId: number, body: {
        description: string;
        taskId: number;
    }): Promise<{
        messsage: string;
        status: number;
    }>;
    getComments(taskId: number): Promise<{
        description: string;
        createdBy: string;
        date: Date;
    }[]>;
}
