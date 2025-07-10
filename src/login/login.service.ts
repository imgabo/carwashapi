import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, name, code } = registerDto;
    
    // Validar el código de registro
    const registrationCode = this.configService.get<string>('REGISTRATION_CODE');
    if (!registrationCode) {
      throw new UnauthorizedException('Código de registro no configurado');
    }
    
    if (code !== registrationCode) {
      throw new UnauthorizedException('Codigo de registro inválido');
    }

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('Correo electrónico ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    return this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto, deviceInfo?: string, ipAddress?: string): Promise<{ token: string; refreshToken: string; user: { id: number; name: string; email: string } }> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Revocar todos los refresh tokens existentes del usuario (opcional)
    await this.refreshTokenRepository.update(
      { user_id: user.id },
      { is_revoked: true }
    );

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    
    // Generar refresh token único
    const refreshTokenValue = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 días

    // Guardar refresh token en la base de datos
    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshTokenValue,
      user_id: user.id,
      expires_at: refreshTokenExpiry,
      device_info: deviceInfo,
      ip_address: ipAddress,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return { 
      token, 
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ token: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto;

    // Buscar el refresh token en la base de datos
    const storedRefreshToken = await this.refreshTokenRepository.findOne({
      where: {
        token: refreshToken,
        is_revoked: false,
        expires_at: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    if (!storedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Verificar que el usuario aún exista
    const user = await this.usersRepository.findOne({ where: { id: storedRefreshToken.user_id } });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revocar el refresh token actual
    await this.refreshTokenRepository.update(
      { id: storedRefreshToken.id },
      { is_revoked: true }
    );

    // Generar nuevos tokens
    const payload = { sub: user.id, email: user.email };
    const newToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    
    // Generar nuevo refresh token
    const newRefreshTokenValue = crypto.randomBytes(64).toString('hex');
    const newRefreshTokenExpiry = new Date();
    newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 7); // 7 días

    // Guardar nuevo refresh token en la base de datos
    const newRefreshTokenEntity = this.refreshTokenRepository.create({
      token: newRefreshTokenValue,
      user_id: user.id,
      expires_at: newRefreshTokenExpiry,
      device_info: storedRefreshToken.device_info,
      ip_address: storedRefreshToken.ip_address,
    });

    await this.refreshTokenRepository.save(newRefreshTokenEntity);

    return { token: newToken, refreshToken: newRefreshTokenValue };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token: refreshToken },
      { is_revoked: true }
    );
  }

  async revokeAllUserRefreshTokens(userId: number): Promise<void> {
    await this.refreshTokenRepository.update(
      { user_id: userId },
      { is_revoked: true }
    );
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository.delete({
      expires_at: MoreThan(new Date()),
    });
  }
}
