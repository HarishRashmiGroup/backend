import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('search')
  async searchUsers(@Query('q') searchKey: string) {
    return this.userService.searchUsers(searchKey);
  }

  @Post('send-otp')
  async sendOTP(@Body() body: { email: string }) {
    return this.userService.sendOTP(body.email);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() body: { email: string, otp: number})
  {
    return this.userService.verifyOTP(body.email, body.otp);
  }
}
