import { registerAs } from '@nestjs/config';
import { CookieOptions } from 'express';
import { ONE_DAY } from 'src/_common/constants/time.constant';
import {
  APP_DOMAIN_PRODUCTION,
  FRONTEND_LOCAL,
  FRONTEND_PRODUCTION,
} from 'src/_common/constants/uri.constant';

export interface AppConfig {
  cors: {
    origin: string[];
  };
  cookies: {
    accessToken: {
      name: string;
      options: CookieOptions;
    };
  };
  jwt: {
    secret: string;
    expiresIn: number;
  };
  recaptcha: {
    secretKey: string;
  }
}

export default registerAs('app', (): AppConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    cors: {
      origin: isProduction ? [FRONTEND_PRODUCTION] : [FRONTEND_LOCAL],
    },
    cookies: {
      accessToken: {
        name: 'atk',
        options: {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'strict' : 'lax',
          ...(isProduction ? { domain: APP_DOMAIN_PRODUCTION } : {}),
          maxAge: ONE_DAY * 7,
        } as CookieOptions,
      },
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
      expiresIn: ONE_DAY * 7,
    },
    recaptcha: {
      secretKey: process.env.RECAPTCHA_SECRET_KEY!,
    }
  };
});
