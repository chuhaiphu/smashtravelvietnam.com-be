import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { CreateCustomTourRequestRequestDto } from 'src/_common/dtos/request/create-custom-tour-request.request.dto';
import appConfig from 'src/_core/configs/app.config';
import { CustomTourRequestResponseDto } from 'src/_common/dtos/response/custom-tour-request.response.dto';

@Injectable()
export class CustomTourRequestService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
    @Inject(appConfig.KEY)
    private readonly appConf: ConfigType<typeof appConfig>
  ) { }

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

  async create(dto: CreateCustomTourRequestRequestDto): Promise<CustomTourRequestResponseDto> {
    if (dto.recaptchaToken) {
      const isValid = await this.verifyRecaptcha(dto.recaptchaToken);
      if (!isValid) {
        throw new BadRequestException('Invalid reCAPTCHA');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryIds, recaptchaToken, ...requestData } = dto;

    const customTourRequest = await this.prismaService.customTourRequest.create({
      data: {
        ...requestData,
        destinations: dto.destinations || [],
        tourCategoryCustomTourRequests: categoryIds?.length
          ? {
            create: categoryIds.map((categoryId) => ({
              tourCategoryId: categoryId,
            })),
          }
          : undefined,
      },
      include: {
        tourCategoryCustomTourRequests: {
          include: {
            tourCategory: true,
          },
        },
      },
    });

    // Send notification to admin (non-blocking)
    void this.mailService.sendCustomTourRequestNotification({
      customerName: customTourRequest.customerName,
      customerEmail: customTourRequest.customerEmail,
      customerPhone: customTourRequest.customerPhone,
      customerNotes: customTourRequest.customerNotes,
      startDate: customTourRequest.startDate,
      endDate: customTourRequest.endDate,
      adultCount: customTourRequest.adultCount,
      childCount: customTourRequest.childCount,
      destinations: customTourRequest.destinations,
    });

    return customTourRequest;
  }

  async findAll(): Promise<CustomTourRequestResponseDto[]> {
    const requests = await this.prismaService.customTourRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tourCategoryCustomTourRequests: {
          include: {
            tourCategory: true,
          },
        },
      },
    });

    return requests;
  }

  async findById(id: string): Promise<CustomTourRequestResponseDto> {
    const request = await this.prismaService.customTourRequest.findUnique({
      where: { id },
      include: {
        tourCategoryCustomTourRequests: {
          include: {
            tourCategory: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Custom tour request not found');
    }

    return request;
  }

  async delete(id: string) {
    const request = await this.prismaService.customTourRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Custom tour request not found');
    }

    await this.prismaService.customTourRequest.delete({
      where: { id },
    });
  }
}
