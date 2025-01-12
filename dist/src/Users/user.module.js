"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const user_service_1 = require("./user.service");
const user_contoller_1 = require("./user.contoller");
const user_entity_1 = require("./entities/user.entity");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const constant_1 = require("./constant");
const jwt_strategy_1 = require("./jwt.strategy");
const email_module_1 = require("../email/email.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_1.MikroOrmModule.forFeature({
                entities: [user_entity_1.User]
            }),
            email_module_1.EmailModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                useFactory: () => ({
                    secret: constant_1.jwtConstants.secret,
                    signOptions: { expiresIn: '24h' }
                })
            })
        ],
        controllers: [user_contoller_1.UserController],
        providers: [user_service_1.UserService, jwt_strategy_1.JwtStrategy],
        exports: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map