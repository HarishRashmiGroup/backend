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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const task_service_1 = require("./task.service");
const auth_decorator_1 = require("../common/decorators/auth.decorator");
const user_decorator_1 = require("../common/decorators/user.decorator");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    createTask(body, createdById) {
        return this.taskService.createTask(createdById, body.description, body.dueDate, body.userId, body.newUser, body.status);
    }
    getAllTasks(month, year, userId) {
        return this.taskService.getTasks(month, year, userId);
    }
    getAllTasksCounts(month, year, userId) {
        return this.taskService.getTasksCounts(month, year, userId);
    }
    getAllTasksForDay(date, userId) {
        return this.taskService.getAllTaskForDay(date, userId);
    }
    updateTask(id, body, userId) {
        return this.taskService.updateTask(userId, id, body);
    }
    deleteTask(id, userId) {
        return this.taskService.deleteTask(id, userId);
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllTasks", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('counts'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllTasksCounts", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('day'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllTasksForDay", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Number]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateTask", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteTask", null);
exports.TaskController = TaskController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
//# sourceMappingURL=task.controller.js.map