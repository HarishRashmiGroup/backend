import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    searchUsers(searchKey: string): Promise<import("./entities/user.entity").User[]>;
    sendOTP(body: {
        email: string;
    }): Promise<{
        message: string;
        status: number;
    }>;
    verifyOTP(body: {
        email: string;
        otp: number;
    }): Promise<{
        token: string;
    }>;
}
