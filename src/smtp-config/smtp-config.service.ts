import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { UpdateSmtpConfigRequestDto } from 'src/_common/dtos/request/update-smtp-config.request.dto';
import { SmtpConfigResponseDto } from 'src/_common/dtos/response/smtp-config.response.dto';

@Injectable()
export class SmtpConfigService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService
  ) {}

  async get(userId: string): Promise<SmtpConfigResponseDto | null> {
    const config = await this.prismaService.smtpConfig.findFirst({
      where: { userId },
    });

    if (!config) {
      return null;
    }

    // Mask password for security
    return {
      ...config,
      password: '********',
    };
  }

  async update(userId: string, dto: UpdateSmtpConfigRequestDto): Promise<SmtpConfigResponseDto> {
    let config = await this.prismaService.smtpConfig.findFirst({
      where: { userId },
    });

    if (!config) {
      config = await this.prismaService.smtpConfig.create({
        data: {
          ...dto,
          userId,
        },
      });
    } else {
      config = await this.prismaService.smtpConfig.update({
        where: { id: config.id },
        data: dto,
      });
    }

    return {
      ...config,
      password: '********',
    };
  }

  async testEmail(userId: string, email: string): Promise<boolean> {
    const config = await this.prismaService.smtpConfig.findFirst({
      where: { userId },
    });

    if (!config) {
      throw new NotFoundException('SMTP config not found');
    }

    return this.mailService.sendMail({
      to: email,
      subject: 'SMTP Test Email',
      html: '<h2>SMTP Configuration Test</h2><p>If you receive this email, your SMTP configuration is working correctly.</p>',
    });
  }
}
