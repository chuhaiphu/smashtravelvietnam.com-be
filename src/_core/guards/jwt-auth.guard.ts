import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtValidationReturn } from 'src/_common/interfaces/interface';
import { TokenInvalidException } from 'src/_common/exceptions/auth.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtValidationReturn>(
    error: unknown,
    user: TUser | false | null,
    info: { name: string; message: string } | undefined
  ): TUser {
    if (error || !user) {
      if (
        info?.name === 'TokenExpiredError' ||
        info?.name === 'JsonWebTokenError'
      ) {
        throw new TokenInvalidException('Token is invalid or has expired');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new UnauthorizedException();
    }

    return user;
  }
}
