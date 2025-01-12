import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
export declare class UserService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly emailService;
    private readonly em;
    constructor(userRepository: EntityRepository<User>, jwtService: JwtService, emailService: EmailService, em: EntityManager);
    searchUsers(searchKey: string): Promise<User[]>;
    generateOtp(): number;
    sendOTP(email: string): Promise<{
        message: string;
        status: number;
    }>;
    verifyOTP(email: string, otp: number): Promise<{
        token: string;
    }>;
    findUserById(userId: number): Promise<import("@mikro-orm/core").Loaded<User, never, "*", never>>;
}
