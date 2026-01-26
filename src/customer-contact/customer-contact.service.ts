import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { CreateCustomerContactRequestDto } from 'src/_common/dtos/request/create-customer-contact.request.dto';
import appConfig from 'src/_core/configs/app.config';
import { CustomerContactResponseDto } from 'src/_common/dtos/response/customer-contact.response.dto';

@Injectable()
export class CustomerContactService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
    @Inject(appConfig.KEY)
    private readonly appConf: ConfigType<typeof appConfig>
  ) {}

  private async verifyRecaptcha(token: string): Promise<boolean> {
    if (!this.appConf.recaptcha.secretKey) {
      return true;
    }

    try {
      const response = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${this.appConf.recaptcha.secretKey}&response=${token}`,
        }
      );

      const data = (await response.json()) as { success: boolean };
      return data.success;
    } catch {
      return false;
    }
  }

  async create(dto: CreateCustomerContactRequestDto) {
    if (dto.recaptchaToken) {
      const isValid = await this.verifyRecaptcha(dto.recaptchaToken);
      if (!isValid) {
        throw new BadRequestException('Invalid reCAPTCHA');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { recaptchaToken, ...contactData } = dto;

    const contact = await this.prismaService.customerContact.create({
      data: contactData,
    });

    // Send notification to admin (non-blocking)
    void this.mailService.sendContactNotification({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      notes: contact.notes,
    });

    return contact;
  }

  async findAll(): Promise<CustomerContactResponseDto[]> {
    const contacts = await this.prismaService.customerContact.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return contacts;
  }

  async findById(id: string): Promise<CustomerContactResponseDto> {
    const contact = await this.prismaService.customerContact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Customer contact not found');
    }

    return contact;
  }

  async delete(id: string) {
    const contact = await this.prismaService.customerContact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Customer contact not found');
    }

    await this.prismaService.customerContact.delete({
      where: { id },
    });
  }
}
