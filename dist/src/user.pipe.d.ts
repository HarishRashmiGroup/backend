import { PipeTransform } from "@nestjs/common";
import { UserService } from "./Users/user.service";
export declare class UserPipe implements PipeTransform {
    private userService;
    constructor(userService: UserService);
    transform(id: number): Promise<import("@mikro-orm/core").Loaded<import("./Users/entities/user.entity").User, never, "*", never>>;
}
