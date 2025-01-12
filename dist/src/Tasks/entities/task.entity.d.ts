import { User } from "../../Users/entities/user.entity";
export declare enum TaskStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    PAUSED = "paused"
}
export declare class Task {
    id: number;
    description: string;
    dueDate: Date;
    status: TaskStatus;
    createdBy: User;
    assignedTo: User | null;
    createdAt: Date;
    updatedAt: Date | null;
    constructor({ createdBy, description, dueDate, status, assignedTo }: {
        createdBy: User;
        description: string;
        dueDate: Date;
        status?: TaskStatus;
        assignedTo?: User;
    });
}
