"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const task_service_1 = require("./task.service");
const task_controller_1 = require("./task.controller");
const task_entity_1 = require("./entities/task.entity");
const user_entity_1 = require("../Users/entities/user.entity");
const schedule_1 = require("@nestjs/schedule");
const email_module_1 = require("../email/email.module");
let TaskModule = class TaskModule {
};
exports.TaskModule = TaskModule;
exports.TaskModule = TaskModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_1.MikroOrmModule.forFeature([task_entity_1.Task, user_entity_1.User]), schedule_1.ScheduleModule.forRoot(), email_module_1.EmailModule],
        providers: [task_service_1.TaskService],
        controllers: [task_controller_1.TaskController],
    })
], TaskModule);
//# sourceMappingURL=task.module.js.map