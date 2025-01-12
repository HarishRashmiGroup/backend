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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const task_entity_1 = require("./entities/task.entity");
const postgresql_1 = require("@mikro-orm/postgresql");
const postgresql_2 = require("@mikro-orm/postgresql");
const user_entity_1 = require("../Users/entities/user.entity");
const tasks_ro_1 = require("./RO/tasks.ro");
const email_service_1 = require("../email/email.service");
const schedule_1 = require("@nestjs/schedule");
const email_template_1 = require("../email/email.template");
let TaskService = class TaskService {
    constructor(taskRepository, userRepository, emailService, em) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.em = em;
    }
    async getPendingDueTasks() {
        const now = new Date();
        return await this.taskRepository.find({
            status: task_entity_1.TaskStatus.PENDING,
            dueDate: { $lte: now }
        }, { populate: ['assignedTo', 'createdBy'] });
    }
    async handleCron() {
        console.log("Cron job called at", new Date());
        const tasks = await this.getPendingDueTasks();
        const emails = tasks
            .filter((task) => task.assignedTo?.email && task.assignedTo.id != 13)
            .map((task) => ({
            to: task.assignedTo.email,
            cc: task.createdBy.email,
            subject: `Task due on ${new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`,
            html: `
        <html>
  <body>
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color:rgb(254, 226, 226); padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <p style="font-size: 16px; color: rgb(153, 27, 27);">
           ${task.description}
        </p>
        <p style="font-size: 16px; color: rgb(153, 27, 27);">
          <strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <h2 style="color: #007bff; text-align: center;">Calendar Management Software</h2>
        <p style="font-size: 14px; color: #777; text-align: center;">
          If you have any questions, please 
        </p>
        <p style="text-align: center; margin-top: 10px;">
          <a href="mailto:harish.kumar@rashmigroup.com" style="color: #007bff; text-decoration: none; font-size: 14px;">Contact Support</a>.
        </p>
      </div>
    </div>
  </body>
</html>`,
        }));
        await this.emailService.sendBulkEmails(emails);
    }
    async createTask(createdById, description, dueDate, userId, newUser, status = task_entity_1.TaskStatus.PENDING) {
        const em = this.em.fork();
        await em.begin();
        try {
            const createdBy = await this.userRepository.findOneOrFail({ id: createdById });
            const noneUser = await this.userRepository.findOneOrFail({ id: 13 });
            let assignedUser = noneUser;
            if (userId && !isNaN(Number(userId))) {
                assignedUser = await this.userRepository.findOneOrFail({ id: userId });
            }
            else if (newUser) {
                const prevUser = await this.userRepository.findOne({ name: newUser.name, email: newUser.email });
                if (prevUser)
                    assignedUser = prevUser;
                else {
                    assignedUser = new user_entity_1.User({
                        name: newUser.name,
                        email: newUser.email.trim().toLowerCase()
                    });
                    await em.persistAndFlush(assignedUser);
                }
            }
            const task = new task_entity_1.Task({
                description,
                dueDate,
                status,
                createdBy,
                assignedTo: assignedUser
            });
            const subject = `${createdBy.name} added a work for you.`;
            const text = `
        <html>
  <body>
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <p style="font-size: 16px; color: #333;">
           ${description}
        </p>
        <p style="font-size: 16px; color: #333;">
          <strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <h2 style="color: #007bff; text-align: center;">Calendar Management Software</h2>
        <p style="font-size: 14px; color: #777; text-align: center;">
          If you have any questions, please 
        </p>
        <p style="text-align: center; margin-top: 10px;">
          <a href="mailto:harish.kumar@rashmigroup.com" style="color: #007bff; text-decoration: none; font-size: 14px;">Contact Support</a>.
        </p>
      </div>
    </div>
  </body>
</html>`;
            if (assignedUser.id != 13)
                this.emailService.sendEmailWithCC(assignedUser.email, createdBy.email, subject, text);
            await em.persistAndFlush(task);
            await em.commit();
            return {
                status: 201,
                message: "Task created successfully",
                data: {
                    taskId: task.id,
                    assignedUserId: assignedUser?.id
                }
            };
        }
        catch (error) {
            await em.rollback();
            throw new Error(`Failed to create task: ${error.message}`);
        }
    }
    async getTasks(month, year, userId) {
        const startOfMonth = new Date(year, month, 1);
        month++;
        const endOfMonth = new Date(year, month, 1);
        const tasks = await this.taskRepository.find({
            dueDate: { $gte: startOfMonth, $lt: endOfMonth },
            $or: [
                { createdBy: userId },
                { assignedTo: userId }
            ]
        }, {
            populate: ['createdBy', 'assignedTo'],
            orderBy: { createdAt: 'DESC' }
        });
        return tasks.map((task) => new tasks_ro_1.TasksRO(task));
    }
    async getTasksCounts(month, year, userId) {
        if (isNaN(month) || isNaN(year))
            throw new common_1.BadRequestException('Invalid month or year.');
        const startOfMonth = new Date(year, month, 1);
        month++;
        const endOfMonth = new Date(year, month, 1);
        const query = `
       SELECT 
          jsonb_object_agg(
              due_date,
              jsonb_build_object(
                  'pending', pending_count,
                  'paused', paused_count,
                  'completed', completed_count
              )
          ) AS mapping
      FROM (
          SELECT
              TO_CHAR(due_date AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS due_date,
              COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count,
              COUNT(CASE WHEN status = 'paused' THEN 1 END) AS paused_count,
              COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_count
          FROM task
          WHERE 
              (task.created_by_id = ${userId} OR task.assigned_to_id = ${userId})
              AND (task.due_date AT TIME ZONE 'Asia/Kolkata' >= '${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}-${String(startOfMonth.getDate()).padStart(2, '0')}' 
                  AND task.due_date AT TIME ZONE 'Asia/Kolkata' < '${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}')
          GROUP BY TO_CHAR(due_date AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD')
      ) AS task_counts;`;
        const connection = this.em.getConnection();
        const knex = connection.getKnex();
        const result = await connection.execute(query);
        return result[0]?.mapping || {};
    }
    async getAllTaskForDay(date, userId) {
        if (isNaN(new Date(date).getTime())) {
            throw new common_1.BadRequestException('Invalid date.');
        }
        const tasks = await this.taskRepository.find({
            dueDate: new Date(date),
            $or: [
                { createdBy: userId },
                { assignedTo: userId }
            ]
        }, { populate: ['createdBy', 'assignedTo'] });
        return tasks.map((task) => (new tasks_ro_1.TasksRO(task)));
    }
    async updateTask(userId, id, updatedFields) {
        const task = await this.taskRepository.findOne({ id }, { populate: ['createdBy', 'assignedTo'] });
        if (!task) {
            throw new Error('Task not found');
        }
        const originalTask = {
            description: task.description,
            status: task.status,
            responsiblePersonName: task.assignedTo.name,
            createdBy: task.createdBy.name,
            isOverdue: task.dueDate <= new Date()
        };
        let assignedTo = task.assignedTo;
        if (!isNaN(updatedFields.assignedTo)) {
            assignedTo = await this.userRepository.findOneOrFail({ id: updatedFields.assignedTo });
        }
        if (updatedFields.newUserEmail && updatedFields.newUserName) {
            const prevUser = await this.userRepository.findOne({
                email: updatedFields.newUserEmail
            });
            if (prevUser)
                assignedTo = prevUser;
            else {
                assignedTo = new user_entity_1.User({
                    name: updatedFields.newUserName,
                    email: updatedFields.newUserEmail.trim().toLowerCase()
                });
                this.em.persist(assignedTo);
            }
        }
        (0, postgresql_1.wrap)(task).assign({
            description: updatedFields.description,
            status: updatedFields.status ?? task.status,
            assignedTo,
            dueDate: updatedFields.dueDate ?? task.dueDate
        });
        await this.em.flush();
        const updatedTask = {
            description: task.description,
            status: task.status,
            responsiblePersonName: assignedTo.name,
            createdBy: task.createdBy.name,
            isOverdue: task.dueDate <= new Date()
        };
        if (userId != task.createdBy.id) {
            try {
                const emailHtml = (0, email_template_1.createTaskEmailTemplate)(originalTask, updatedTask, 'updated');
                await this.emailService.sendEmailWithCC(task.createdBy.email, assignedTo.email, `Task Updated: ${task.description.substring(0, 50)}...`, emailHtml);
            }
            catch (error) {
            }
        }
        return { status: 200, message: "Task updated." };
    }
    async deleteTask(id, userId) {
        const task = await this.taskRepository.findOne({ id }, { populate: ['createdBy', 'assignedTo'] });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.createdBy.id != userId && task.assignedTo.id != userId) {
            throw new common_1.BadRequestException('Invalid request.');
        }
        const taskInfo = {
            description: task.description,
            status: task.status,
            responsiblePersonName: task.assignedTo.name,
            createdBy: task.createdBy.name,
            isOverdue: task.dueDate < new Date()
        };
        await this.em.removeAndFlush(task);
        if (userId != task.createdBy.id) {
            try {
                const emailHtml = (0, email_template_1.createTaskEmailTemplate)(taskInfo, null, 'deleted');
                this.emailService.sendEmailWithCC(task.createdBy.email, task.assignedTo.email, `Task Deleted: ${task.description.substring(0, 50)}...`, emailHtml);
            }
            catch (error) {
            }
        }
        return { status: 200, message: "Task deleted." };
    }
};
exports.TaskService = TaskService;
__decorate([
    (0, schedule_1.Cron)('52 5 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskService.prototype, "handleCron", null);
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, nestjs_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [postgresql_1.EntityRepository,
        postgresql_1.EntityRepository,
        email_service_1.EmailService,
        postgresql_2.EntityManager])
], TaskService);
//# sourceMappingURL=task.service.js.map