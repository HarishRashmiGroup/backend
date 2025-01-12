import { TaskService } from './task.service';
import { TaskStatus } from './entities/task.entity';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    createTask(body: {
        description: string;
        dueDate: Date;
        userId?: number;
        newUser?: {
            name: string;
            email: string;
        };
        status?: TaskStatus;
    }, createdById: number): Promise<{
        status: number;
        message: string;
        data: {
            taskId: number;
            assignedUserId: number;
        };
    }>;
    getAllTasks(month: number, year: number, userId: number): Promise<import("./RO/tasks.ro").TasksRO[]>;
    getAllTasksCounts(month: number, year: number, userId: number): Promise<{
        [dueDate: string]: {
            pending: number;
            paused: number;
            completed: number;
        };
    }>;
    getAllTasksForDay(date: string, userId: number): Promise<import("./RO/tasks.ro").TasksRO[]>;
    updateTask(id: number, body: Partial<{
        description: string;
        dueDate: Date;
        status: TaskStatus;
        assignedTo: number;
        newUserName: string;
        newUserEmail: string;
    }>, userId: number): Promise<{
        status: number;
        message: string;
    }>;
    deleteTask(id: number, userId: number): Promise<{
        status: number;
        message: string;
    }>;
}
