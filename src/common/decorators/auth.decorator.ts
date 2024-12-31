import { applyDecorators, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/Users/jwt-auth.guards"

export function Auth() {
    return applyDecorators(
        UseGuards(
            JwtAuthGuard
        )
    )
}