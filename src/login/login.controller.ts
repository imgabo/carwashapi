import { Controller, Post, Body, Req, Ip } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request } from 'express';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.loginService.register(registerDto);
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Ip() ip: string
  ) {
    const deviceInfo = req.headers['user-agent'] || 'Unknown device';
    return this.loginService.login(loginDto, deviceInfo, ip);
  }

  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.loginService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.loginService.revokeRefreshToken(refreshTokenDto.refreshToken);
    return { message: 'Logged out successfully' };
  }
}
