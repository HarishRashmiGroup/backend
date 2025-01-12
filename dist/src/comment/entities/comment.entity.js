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
exports.Comment = void 0;
const core_1 = require("@mikro-orm/core");
const user_entity_1 = require("../../Users/entities/user.entity");
const task_entity_1 = require("../../Tasks/entities/task.entity");
let Comment = class Comment {
    constructor({ description, createdBy, task }) {
        this.createdAt = new Date();
        this.createdBy = createdBy;
        this.task = task;
        this.description = description;
    }
};
exports.Comment = Comment;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text' }),
    __metadata("design:type", String)
], Comment.prototype, "description", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => user_entity_1.User }),
    __metadata("design:type", user_entity_1.User)
], Comment.prototype, "createdBy", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => task_entity_1.Task, cascade: [core_1.Cascade.REMOVE] }),
    __metadata("design:type", task_entity_1.Task)
], Comment.prototype, "task", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Object)
], Comment.prototype, "createdAt", void 0);
exports.Comment = Comment = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Comment);
//# sourceMappingURL=comment.entity.js.map