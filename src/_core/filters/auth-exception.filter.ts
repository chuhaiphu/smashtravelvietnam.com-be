import { TokenInvalidException } from 'src/_common/exceptions/auth.exception';
import { Catch, ExceptionFilter, ArgumentsHost, Inject } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import appConfig from '../configs/app.config';
import type { ConfigType } from '@nestjs/config';

@Catch(TokenInvalidException, UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConf: ConfigType<typeof appConfig>
  ) {}

  catch(
    exception: TokenInvalidException | UnauthorizedException,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.clearCookie(this.appConf.cookies.accessToken.name, {
      ...this.appConf.cookies.accessToken.options,
    });
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.message,
    });
  }
}
