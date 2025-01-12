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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@mikro-orm/core");
const nestjs_1 = require("@mikro-orm/nestjs");
const user_entity_1 = require("./entities/user.entity");
const crypto_1 = require("crypto");
const jwt_1 = require("@nestjs/jwt");
const email_service_1 = require("../email/email.service");
const email_template_1 = require("../email/email.template");
let UserService = class UserService {
    constructor(userRepository, jwtService, emailService, em) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.em = em;
    }
    async searchUsers(searchKey) {
        const results = await this.userRepository.find({
            $or: [
                { id: isNaN(Number(searchKey)) ? null : Number(searchKey) },
                { name: { $ilike: `%${searchKey}%` } },
                { email: { $ilike: `%${searchKey}%` } },
            ],
        }, { limit: 5, orderBy: { name: 'asc' } });
        return results;
    }
    generateOtp() {
        const otp = (0, crypto_1.randomInt)(1000, 10000);
        return otp;
    }
    async sendOTP(email) {
        const user = await this.userRepository.findOneOrFail({ email: email.trim().toLowerCase() });
        const otp = this.generateOtp();
        (0, core_1.wrap)(user).assign({ otp });
        this.emailService.sendEmail(user.email, 'Login OTP For RashmiCalender', (0, email_template_1.otpTemplate)(otp));
        await this.em.flush();
        return { message: 'otp sent successfully.', status: 200 };
    }
    async verifyOTP(email, otp) {
        const user = await this.userRepository.findOneOrFail({ email: email.trim().toLowerCase() });
        if (user.otp == otp) {
            (0, core_1.wrap)(user).assign({ otp: null });
            const payload = {
                userId: user.id,
                email: user.email,
                name: user.name,
            };
            const token = this.jwtService.sign(payload);
            await this.em.flush();
            return { token };
        }
    }
    async findUserById(userId) {
        return await this.userRepository.findOneOrFail({ id: userId });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [core_1.EntityRepository,
        jwt_1.JwtService,
        email_service_1.EmailService,
        core_1.EntityManager])
], UserService);
//# sourceMappingURL=user.service.js.map