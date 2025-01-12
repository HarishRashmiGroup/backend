import { Task, TaskStatus } from './entities/task.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../Users/entities/user.entity';
import { TasksRO } from './RO/tasks.ro';
import { EmailService } from '../email/email.service';
export declare class TaskService {
    private readonly taskRepository;
    private readonly userRepository;
    private readonly emailService;
    private readonly em;
    constructor(taskRepository: EntityRepository<Task>, userRepository: EntityRepository<User>, emailService: EmailService, em: EntityManager);
    getPendingDueTasks(): Promise<Task[]>;
    handleCron(): Promise<void>;
    createTask(createdById: number, description: string, dueDate: Date, userId?: number, newUser?: {
        name: string;
        email: string;
    }, status?: TaskStatus): Promise<{
        status: number;
        message: string;
        data: {
            taskId: number;
            assignedUserId: number;
        };
    }>;
    getTasks(month: number, year: number, userId: number): Promise<TasksRO[]>;
    getTasksCounts(month: number, year: number, userId: number): Promise<{
        [dueDate: string]: {
            pending: number;
            paused: number;
            completed: number;
        };
    }>;
    getAllTaskForDay(date: string, userId: number): Promise<TasksRO[]>;
    updateTask(userId: number, id: number, updatedFields: Partial<{
        description: string;
        dueDate: Date;
        status: TaskStatus;
        assignedTo: number;
        newUserName: string;
        newUserEmail: string;
    }>): Promise<{
        status: number;
        message: string;
    }>;
    deleteTask(id: number, userId: number): Promise<{
        status: number;
        message: string;
    }>;
}
