import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "../../Users/entities/user.entity";

export enum TaskStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    PAUSED = 'paused',
}

@Entity()
export class Task {
    @PrimaryKey()
    id: number;

    @Property({ type: 'text' })
    description: string;

    @Property({ type: 'date' })
    dueDate: Date;

    @Enum({ items: () => TaskStatus, default: TaskStatus.PENDING })
    status: TaskStatus;

    @ManyToOne({ entity: () => User })
    createdBy: User;

    @ManyToOne({ entity: () => User, nullable: true, default: null })
    assignedTo: User | null;

    @Property({ onCreate: () => new Date() })
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date | null = null;

    constructor({ createdBy, description, dueDate, status, assignedTo }: { createdBy: User, description: string, dueDate: Date, status?: TaskStatus, assignedTo?: User }) {
        this.createdBy = createdBy;
        this.assignedTo = assignedTo;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status ?? TaskStatus.PENDING;
    }
}
