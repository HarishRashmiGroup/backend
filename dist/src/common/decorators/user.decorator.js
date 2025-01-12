"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserFromToken = exports.User = void 0;
const common_1 = require("@nestjs/common");
const user_pipe_1 = require("../../user.pipe");
exports.User = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return Number(request.user.userId);
});
const GetUserFromToken = () => (0, exports.User)(user_pipe_1.UserPipe);
exports.GetUserFromToken = GetUserFromToken;
//# sourceMappingURL=user.decorator.js.map