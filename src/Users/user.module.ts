import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserService } from './user.service';
import { UserController } from './user.contoller';
import { User } from './entities/user.entity';
import { EmailService } from '../email/email.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { JwtStrategy } from './jwt.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [MikroOrmModule.forFeature({
    entities: [User]
  }),
  EmailModule,
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.registerAsync({
    useFactory: () => ({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    })
  })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule { }
