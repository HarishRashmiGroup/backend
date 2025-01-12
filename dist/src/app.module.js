"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const mikro_orm_config_1 = require("./mikro-orm.config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const task_module_1 = require("./Tasks/task.module");
const user_module_1 = require("./Users/user.module");
const schedule_1 = require("@nestjs/schedule");
const jwtMiddleware_1 = require("./common/jwtMiddleware");
const comment_module_1 = require("./comment/comment.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(jwtMiddleware_1.JwtMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_1.MikroOrmModule.forRoot(mikro_orm_config_1.default),
            task_module_1.TaskModule,
            user_module_1.UserModule,
            comment_module_1.CommentModule,
            schedule_1.ScheduleModule.forRoot()
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map