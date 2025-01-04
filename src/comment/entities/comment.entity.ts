import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "../../Users/entities/user.entity";
import { Task } from "../../Tasks/entities/task.entity";


@Entity()
export class Comment {
    @PrimaryKey()
    id: number;

    @Property({ type: 'text' })
    description: string;

    @ManyToOne({ entity: () => User })
    createdBy: User;

    @ManyToOne({ entity: () => Task, cascade: [Cascade.REMOVE]})
    task: Task;

    @Property({ onCreate: () => new Date() })
    createdAt = new Date();

    constructor({ description, createdBy, task }: { createdBy: User, description: string, task: Task }) {
        this.createdBy = createdBy;
        this.task = task;
        this.description = description;
    }
}
