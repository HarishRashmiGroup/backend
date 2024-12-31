import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { UserService } from "./Users/user.service";

@Injectable()
export class UserPipe implements PipeTransform{
    constructor(private userService: UserService){}
    async transform(id: number){
        const user = await this.userService.findUserById(id);
        if(!user){
            throw new BadRequestException("user not found");
        }
        return user;
    }
}