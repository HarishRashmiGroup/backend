import { Task, TaskStatus } from "../entities/task.entity";
export declare class TasksRO {
    id: number;
    description: string;
    dueDate: Date;
    responsiblePersonName: string;
    responsiblePersonEmail: string;
    createdBy: string;
    status: TaskStatus;
    constructor(task: Task);
}
