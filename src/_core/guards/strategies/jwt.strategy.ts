import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import appConfig from 'src/_core/configs/app.config';
import type { ConfigType } from '@nestjs/config';
import {
  JwtPayload,
  JwtValidationReturn,
} from 'src/_common/interfaces/interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(appConfig.KEY)
    appConf: ConfigType<typeof appConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          return (request.cookies?.atk as string) || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: appConf.jwt.secret,
    });
  }

  validate(payload: JwtPayload): JwtValidationReturn {
    return { userId: payload.sub };
  }
}
