import { User } from "../../Users/entities/user.entity";
import { Task } from "../../Tasks/entities/task.entity";
export declare class Comment {
    id: number;
    description: string;
    createdBy: User;
    task: Task;
    createdAt: Date;
    constructor({ description, createdBy, task }: {
        createdBy: User;
        description: string;
        task: Task;
    });
}
