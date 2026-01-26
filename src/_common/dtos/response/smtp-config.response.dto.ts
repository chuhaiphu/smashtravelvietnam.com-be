import { User } from 'src/prisma/generated/client';

export class SmtpConfigResponseDto {
  id: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  receiveEmail: string | null;
  updatedAt: Date;
  userId: string;
  user?: User;
}
