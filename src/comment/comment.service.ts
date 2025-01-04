import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Task } from "src/Tasks/entities/task.entity";
import { User } from "src/Users/entities/user.entity";
import { Comment } from "./entities/comment.entity";
import { commentMailTemplate } from "src/email/email.template";
import { EmailService } from "src/email/email.service";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,

        @InjectRepository(Task)
        private readonly taskRepository: EntityRepository<Task>,

        @InjectRepository(Comment)
        private readonly commentRepository: EntityRepository<Comment>,

        private readonly emailService: EmailService,
        private readonly em: EntityManager,
    ) { }
    async createTask(userId: number, description: string, taskId: number) {
        const [user, task] = await Promise.all([this.userRepository.findOneOrFail({ id: userId }),
        this.taskRepository.findOneOrFail({ id: taskId }, { populate: ['assignedTo', 'createdBy'] })]);
        if (user.id != task.assignedTo.id && user.id != task.createdBy.id) {
            throw new BadRequestException('Bad Request');
        }
        const comment = new Comment({ description, createdBy: user, task });
        const didOwnerCommented = userId === task.createdBy.id;
        await this.em.persistAndFlush(comment);
        const to = didOwnerCommented ? task.assignedTo.email : task.createdBy.email;
        const cc = didOwnerCommented ? task.createdBy.email : task.assignedTo.email
        if (task.assignedTo.id != 13) {
            try {
                const emailHtml = commentMailTemplate(description, user.name, task.description);
                await this.emailService.sendEmailWithCC(
                    to,
                    cc,
                    `New comment on: ${task.description.substring(0, 30)}...`,
                    emailHtml
                );
            } catch (error) {
                // this.logger.error('Failed to send task update email:', error);
            }
        }
        return { messsage: 'Comment added.', status: 201 };
    }
    async getComments(taskId: number) {
        const [task, comments] = await Promise.all([this.taskRepository.findOneOrFail({ id: taskId }), this.commentRepository.find({ task: taskId }, { orderBy: { createdAt: 'ASC' } })]);
        //Todo: logic for handling not assigned user.
        return comments.map((comment) => ({
            description: comment.description,
            createdBy: comment.createdBy,
            date: comment.createdAt,
        }));
    }
}