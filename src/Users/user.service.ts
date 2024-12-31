import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly em: EntityManager,
  ) { }

  async searchUsers(searchKey: string): Promise<User[]> {
    const results = await this.userRepository.find(
      {
        $or: [
          { id: isNaN(Number(searchKey)) ? null : Number(searchKey) },
          { name: { $ilike: `%${searchKey}%` } },
          { email: { $ilike: `%${searchKey}%` } },
        ],
      },
      { limit: 5, orderBy: { name: 'asc' } },
    );

    return results;
  }

  generateOtp(): number {
    const otp = randomInt(1000, 10000);
    return otp;
  }

  async sendOTP(email: string) {
    const user = await this.userRepository.findOneOrFail({ email });
    const otp = this.generateOtp();
    wrap(user).assign({ otp });
    this.emailService.sendEmail(user.email, 'Login OTP For RashmiCalenderManagement', `OTP: ${otp}`);
    await this.em.flush();
    return {message:'otp sent', status: 200};
  }

  async verifyOTP(email: string, otp: number){
    const user = await this.userRepository.findOneOrFail({email});
    if(user.otp == otp){
      wrap(user).assign({otp: null});
      const payload = {
        userId: user.id,
        email: user.email,
        name: user.name,
      };
      const token = this.jwtService.sign(payload);
      await this.em.flush();
      return {token};
    }
  }

  async findUserById(userId: number){
    return await this.userRepository.findOneOrFail({id: userId});
  }
}
