"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.TaskStatus = void 0;
const core_1 = require("@mikro-orm/core");
const user_entity_1 = require("../../Users/entities/user.entity");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["PAUSED"] = "paused";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
let Task = class Task {
    constructor({ createdBy, description, dueDate, status, assignedTo }) {
        this.createdAt = new Date();
        this.updatedAt = null;
        this.createdBy = createdBy;
        this.assignedTo = assignedTo;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status ?? TaskStatus.PENDING;
    }
};
exports.Task = Task;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Task.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text' }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ type: 'date' }),
    __metadata("design:type", Date)
], Task.prototype, "dueDate", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => TaskStatus, default: TaskStatus.PENDING }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => user_entity_1.User }),
    __metadata("design:type", user_entity_1.User)
], Task.prototype, "createdBy", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => user_entity_1.User, nullable: true, default: null }),
    __metadata("design:type", user_entity_1.User)
], Task.prototype, "assignedTo", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Object)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
exports.Task = Task = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Task);
//# sourceMappingURL=task.entity.js.map