import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSmtpConfigRequestDto {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsBoolean()
  @IsOptional()
  secure?: boolean;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fromName: string;

  @IsEmail()
  @IsNotEmpty()
  fromEmail: string;

  @IsEmail()
  @IsOptional()
  receiveEmail?: string;
}
