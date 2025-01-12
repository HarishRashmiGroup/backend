"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const nestjs_1 = require("@mikro-orm/nestjs");
const postgresql_1 = require("@mikro-orm/postgresql");
const common_1 = require("@nestjs/common");
const task_entity_1 = require("../Tasks/entities/task.entity");
const user_entity_1 = require("../Users/entities/user.entity");
const comment_entity_1 = require("./entities/comment.entity");
const email_template_1 = require("../email/email.template");
const email_service_1 = require("../email/email.service");
let CommentService = class CommentService {
    constructor(userRepository, taskRepository, commentRepository, emailService, em) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
        this.emailService = emailService;
        this.em = em;
    }
    async createTask(userId, description, taskId) {
        const [user, task] = await Promise.all([this.userRepository.findOneOrFail({ id: userId }),
            this.taskRepository.findOneOrFail({ id: taskId }, { populate: ['assignedTo', 'createdBy'] })]);
        if (user.id != task.assignedTo.id && user.id != task.createdBy.id) {
            throw new common_1.BadRequestException('Bad Request');
        }
        const comment = new comment_entity_1.Comment({ description, createdBy: user, task });
        const didOwnerCommented = userId === task.createdBy.id;
        await this.em.persistAndFlush(comment);
        const to = didOwnerCommented ? task.assignedTo.email : task.createdBy.email;
        const cc = didOwnerCommented ? task.createdBy.email : task.assignedTo.email;
        if (task.assignedTo.id != 13) {
            const emailHtml = (0, email_template_1.commentMailTemplate)(description, user.name, task.description);
            this.emailService.sendEmailWithCC(to, cc, `New comment on: ${task.description.substring(0, 30)}...`, emailHtml);
        }
        return { messsage: 'Comment added.', status: 201 };
    }
    async getComments(taskId) {
        const [task, comments] = await Promise.all([this.taskRepository.findOneOrFail({ id: taskId }), this.commentRepository.find({ task: taskId }, { fields: ['createdBy.name', 'description', 'createdAt'], orderBy: { createdAt: 'ASC' } })]);
        return comments.map((comment) => ({
            description: comment.description,
            createdBy: comment.createdBy.name,
            date: comment.createdAt,
        }));
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, nestjs_1.InjectRepository)(task_entity_1.Task)),
    __param(2, (0, nestjs_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [postgresql_1.EntityRepository,
        postgresql_1.EntityRepository,
        postgresql_1.EntityRepository,
        email_service_1.EmailService,
        postgresql_1.EntityManager])
], CommentService);
//# sourceMappingURL=comment.service.js.map