import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Task, TaskStatus } from './entities/task.entity';
import { EntityRepository, wrap } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from 'src/Users/entities/user.entity';
import { TasksRO } from './RO/tasks.ro';
import { EmailService } from 'src/email/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createTaskEmailTemplate } from '../email/email.template';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: EntityRepository<Task>,

    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,

    private readonly emailService: EmailService,

    private readonly em: EntityManager,
  ) { }

  async getPendingDueTasks(): Promise<Task[]> {
    const now = new Date();
    return await this.taskRepository.find({
      status: TaskStatus.PENDING,
      dueDate: { $lte: now }
    }, { populate: ['assignedTo', 'createdBy'] });
  }

  @Cron('52 5 * * *')
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

  async createTask(
    createdById: number,
    description: string,
    dueDate: Date,
    userId?: number,
    newUser?: { name: string; email: string },
    status: TaskStatus = TaskStatus.PENDING,
  ) {
    const em = this.em.fork();
    await em.begin();
    try {
      const createdBy = await this.userRepository.findOneOrFail({ id: createdById });
      const noneUser = await this.userRepository.findOneOrFail({ id: 13 });
      let assignedUser = noneUser;
      if (userId && !isNaN(Number(userId))) {
        assignedUser = await this.userRepository.findOneOrFail({ id: userId });
      } else if (newUser) {
        const prevUser = await this.userRepository.findOne({ name: newUser.name, email: newUser.email });
        if (prevUser) assignedUser = prevUser;
        else {
          assignedUser = new User({
            name: newUser.name,
            email: newUser.email.trim().toLowerCase()
          });
          await em.persistAndFlush(assignedUser);
        }
      }
      const task = new Task({
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
      if (assignedUser.id != 13) this.emailService.sendEmailWithCC(assignedUser.email, createdBy.email, subject, text);
      console.log(createdBy);
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
    } catch (error) {
      await em.rollback();
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async getTasks(month: number, year: number, userId: number): Promise<TasksRO[]> {
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
    return tasks.map((task) => new TasksRO(task));
  }

  async getTasksCounts(month: number, year: number, userId: number) {
    if (isNaN(month) || isNaN(year)) throw new BadRequestException('Invalid month or year.')
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
    const result = await connection.execute<{ mapping: { [dueDate: string]: { pending: number, paused: number, completed: number } } }[]>(query);
    return result[0]?.mapping || {};
  }

  async getAllTaskForDay(date: string, userId: number) {
    if (isNaN(new Date(date).getTime())) {
      throw new BadRequestException('Invalid date.');
    }
    const tasks = await this.taskRepository.find({
      dueDate: new Date(date),
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ]
    }, { populate: ['createdBy', 'assignedTo'] });
    return tasks.map((task) => (new TasksRO(task)));
  }


  // async updateTask(id: number, updatedFields: Partial<{ description: string; dueDate: Date; status: TaskStatus, assignedTo: number, newUserName: string, newUserEmail: string }>) {
  //   const task = await this.taskRepository.findOne(id);
  //   let assignedTo = task.assignedTo;
  //   if (!isNaN(updatedFields.assignedTo)) {
  //     assignedTo = await this.userRepository.findOneOrFail({ id: updatedFields.assignedTo });
  //   }
  //   if (updatedFields.newUserEmail && updatedFields.newUserName) {
  //     const prevUser = await this.userRepository.findOne({ name: updatedFields.newUserName, email: updatedFields.newUserEmail });
  //     if (prevUser) assignedTo = prevUser;
  //     else {
  //       assignedTo = new User({ name: updatedFields.newUserEmail, email: updatedFields.newUserEmail });
  //       this.em.persist(assignedTo);
  //     }
  //   }
  //   if (task) {
  //     wrap(task).assign({ description: updatedFields.description, status: updatedFields.status ?? task.status, assignedTo, dueDate: updatedFields.dueDate ?? task.dueDate });
  //     await this.em.flush();
  //   }
  //   return { status: 200, message: "Task updated." };
  // }
  async updateTask(userId: number, id: number, updatedFields: Partial<{
    description: string;
    dueDate: Date;
    status: TaskStatus,
    assignedTo: number,
    newUserName: string,
    newUserEmail: string
  }>) {
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
      if (prevUser) assignedTo = prevUser;
      else {
        assignedTo = new User({
          name: updatedFields.newUserName,
          email: updatedFields.newUserEmail.trim().toLowerCase()
        });
        this.em.persist(assignedTo);
      }
    }

    wrap(task).assign({
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
        const emailHtml = createTaskEmailTemplate(originalTask, updatedTask, 'updated');
        await this.emailService.sendEmailWithCC(
          task.createdBy.email,
          assignedTo.email,
          `Task Updated: ${task.description.substring(0, 50)}...`,
          emailHtml
        );
      } catch (error) {
        // this.logger.error('Failed to send task update email:', error);
      }
    }

    return { status: 200, message: "Task updated." };
  }

  async deleteTask(id: number, userId: number) {
    const task = await this.taskRepository.findOne({ id }, { populate: ['createdBy', 'assignedTo'] });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.createdBy.id != userId && task.assignedTo.id != userId) {
      throw new BadRequestException('Invalid request.')
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
        const emailHtml = createTaskEmailTemplate(taskInfo, null, 'deleted');
        this.emailService.sendEmailWithCC(
          task.createdBy.email,
          task.assignedTo.email,
          `Task Deleted: ${task.description.substring(0, 50)}...`,
          emailHtml
        );
      } catch (error) {
        // this.logger.error('Failed to send task deletion email:', error);
      }
    }

    return { status: 200, message: "Task deleted." };
  }

  // async deleteTask(id: number): Promise<void> {
  //   const task = await this.taskRepository.findOne(id);
  //   if (task) {
  //     await this.em.removeAndFlush(task);
  //   }
  // }
}
