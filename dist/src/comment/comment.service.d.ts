import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Task } from "../Tasks/entities/task.entity";
import { User } from "../Users/entities/user.entity";
import { Comment } from "./entities/comment.entity";
import { EmailService } from "../email/email.service";
export declare class CommentService {
    private readonly userRepository;
    private readonly taskRepository;
    private readonly commentRepository;
    private readonly emailService;
    private readonly em;
    constructor(userRepository: EntityRepository<User>, taskRepository: EntityRepository<Task>, commentRepository: EntityRepository<Comment>, emailService: EmailService, em: EntityManager);
    createTask(userId: number, description: string, taskId: number): Promise<{
        messsage: string;
        status: number;
    }>;
    getComments(taskId: number): Promise<{
        description: string;
        createdBy: string;
        date: Date;
    }[]>;
}
