import { registerAs } from '@nestjs/config';
import { CookieOptions } from 'express';
import { ONE_DAY } from 'src/_common/constants/time.constant';
import {
  CLIENT_URL_LOCAL,
  CLIENT_URL_PRODUCTION,
  // CLIENT_DOMAIN_PRODUCTION,
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
  const allowedOrigins = [CLIENT_URL_PRODUCTION, CLIENT_URL_LOCAL];
  return {
    cors: {
      origin: allowedOrigins,
    },
    cookies: {
      accessToken: {
        name: 'atk',
        options: {
          httpOnly: true,
          secure: isProduction,
          sameSite: 'none',
          // ...(isProduction ? { domain: CLIENT_DOMAIN_PRODUCTION } : {}),
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
