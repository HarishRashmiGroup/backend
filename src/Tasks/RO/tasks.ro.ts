import { Task, TaskStatus } from "../entities/task.entity";

export class TasksRO {
    id: number;
    description: string;
    dueDate: Date;
    responsiblePersonName: string;
    responsiblePersonEmail: string;
    createdBy: string;
    status: TaskStatus;
    constructor(task: Task) {
        this.id = task.id;
        this.description = task.description;
        this.dueDate = task.dueDate;
        this.responsiblePersonEmail = task.assignedTo.email;
        this.responsiblePersonName = task.assignedTo.name;
        this.createdBy = task.createdBy.name;
        this.status = task.status;
    }
}