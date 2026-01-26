import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import appConfig from 'src/_core/configs/app.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalSignInRequestDto } from 'src/_common/dtos/request/local-signin.request.dto';
import { AuthResponseDto } from 'src/_common/dtos/response/auth.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(appConfig.KEY)
    private readonly appConf: ConfigType<typeof appConfig>
  ) {}

  async localSignIn(dto: LocalSignInRequestDto): Promise<AuthResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = compareSync(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: this.appConf.jwt.secret,
        expiresIn: this.appConf.jwt.expiresIn / 1000,
      }
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
