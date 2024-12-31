import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./user.service";
import { PassportStrategy } from "@nestjs/passport"; 
import { Strategy } from "passport-jwt"; 
import { ExtractJwt } from "passport-jwt";
import { jwtConstants } from "./constant"; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret, 
        });
    }

    async validate(payload: { userId: number; email: string; name: string }) {
        const user = await this.userService.findUserById(payload.userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        return {
            userId: user.id,
            email: user.email,
            name: user.name
        };
    }
}
