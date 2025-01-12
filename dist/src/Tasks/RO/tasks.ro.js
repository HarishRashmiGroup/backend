"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksRO = void 0;
class TasksRO {
    constructor(task) {
        this.id = task.id;
        this.description = task.description;
        this.dueDate = task.dueDate;
        this.responsiblePersonEmail = task.assignedTo.email;
        this.responsiblePersonName = task.assignedTo.name;
        this.createdBy = task.createdBy.name;
        this.status = task.status;
    }
}
exports.TasksRO = TasksRO;
//# sourceMappingURL=tasks.ro.js.map