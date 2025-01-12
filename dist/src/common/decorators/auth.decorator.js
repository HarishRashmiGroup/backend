"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = Auth;
const common_1 = require("@nestjs/common");
const jwt_auth_guards_1 = require("../../Users/jwt-auth.guards");
function Auth() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(jwt_auth_guards_1.JwtAuthGuard));
}
//# sourceMappingURL=auth.decorator.js.map