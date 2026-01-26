import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { Response } from 'express';
import appConfig from 'src/_core/configs/app.config';
import { AuthService } from './auth.service';
import { LocalSignInRequestDto } from 'src/_common/dtos/request/local-signin.request.dto';
import type { HttpResponse } from 'src/_common/interfaces/interface';
import { AuthResponseDto } from 'src/_common/dtos/response/auth.response.dto';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { JwtValidationReturn } from 'src/_common/interfaces/interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(appConfig.KEY)
    private readonly appConf: ConfigType<typeof appConfig>
  ) {}

  @Post('local')
  async localSignIn(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: LocalSignInRequestDto
  ): Promise<HttpResponse<AuthResponseDto>> {
    const authResult = await this.authService.localSignIn(dto);

    response.cookie(
      this.appConf.cookies.accessToken.name,
      authResult.accessToken,
      this.appConf.cookies.accessToken.options
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Authentication completed successfully',
      data: authResult,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): HttpResponse<void> {
    response.clearCookie(
      this.appConf.cookies.accessToken.name,
      this.appConf.cookies.accessToken.options
    );

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Signed out successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(
    @CurrentUser() user: JwtValidationReturn
  ): Promise<HttpResponse<AuthResponseDto['user']>> {
    const userData = await this.authService.validateUser(user.userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'User data retrieved successfully',
      data: userData,
    };
  }
}
