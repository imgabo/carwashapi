import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
  TypeOrmModule.forFeature([User]),
  ConfigModule.forRoot(),
  LoginModule,
  PassportModule,
  JwtModule.register({
    secret: process.env.SECRET,
    signOptions: { expiresIn: '1h' },
  }),
],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
