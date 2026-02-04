import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { CreateBookingRequestDto } from 'src/_common/dtos/request/create-booking.request.dto';
import { UpdateBookingRequestDto } from 'src/_common/dtos/request/update-booking.request.dto';
import { BookingFilterParamDto } from 'src/_common/dtos/param/booking-filter.param.dto';
import authConfig from 'src/_core/configs/auth.config';
import { BookingResponseDto } from 'src/_common/dtos/response/booking.response.dto';
import { Prisma } from 'src/prisma/generated/client';

@Injectable()
export class BookingService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>
  ) { }

  private async verifyRecaptcha(token: string): Promise<boolean> {
    if (!this.authConf.recaptcha.secretKey) {
      return true; // Skip verification if not configured
    }

    try {
      const response = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${this.authConf.recaptcha.secretKey}&response=${token}`,
        }
      );

      const data = (await response.json()) as { success: boolean };
      return data.success;
    } catch {
      return false;
    }
  }

  async create(dto: CreateBookingRequestDto): Promise<BookingResponseDto> {
    // Verify reCAPTCHA if token provided
    if (dto.recaptchaToken) {
      const isValid = await this.verifyRecaptcha(dto.recaptchaToken);
      if (!isValid) {
        throw new BadRequestException('Invalid reCAPTCHA');
      }
    }

    const tour = await this.prismaService.tour.findUnique({
      where: { id: dto.tourId },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    const adultCount = dto.adultCount || 0;
    const childCount = dto.childCount || 0;
    const adultPrice = tour.discountPrice > 0 ? tour.discountPrice : tour.price;
    const childPrice = tour.childPrice;
    const totalPrice = adultCount * adultPrice + childCount * childPrice;

    const booking = await this.prismaService.booking.create({
      data: {
        tourId: dto.tourId,
        adultCount,
        childCount,
        adultPrice,
        childPrice,
        totalPrice,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        customerNotes: dto.customerNotes,
      },
      include: {
        tour: true,
      },
    });

    // Send confirmation email to customer (non-blocking)
    void this.mailService.sendBookingConfirmation({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      tourTitle: tour.title,
      adultCount: booking.adultCount,
      childCount: booking.childCount,
      totalPrice: booking.totalPrice,
    });

    // Send notification to admin (non-blocking)
    void this.mailService.sendBookingNotificationToAdmin({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      customerNotes: booking.customerNotes,
      tourTitle: tour.title,
      adultCount: booking.adultCount,
      childCount: booking.childCount,
      totalPrice: booking.totalPrice,
    });

    return booking;
  }

  async findAll(filter: BookingFilterParamDto): Promise<BookingResponseDto[]> {
    const where: Prisma.BookingWhereInput = {};

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.tourId) {
      where.tourId = filter.tourId;
    }

    const bookings = await this.prismaService.booking.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        tour: true,
      },
    });

    return bookings;
  }

  async findById(id: string): Promise<BookingResponseDto> {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: {
        tour: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, dto: UpdateBookingRequestDto): Promise<BookingResponseDto> {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updatedBooking = await this.prismaService.booking.update({
      where: { id },
      data: dto,
      include: {
        tour: true,
      },
    });

    return updatedBooking;
  }

  async delete(id: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await this.prismaService.booking.delete({
      where: { id },
    });
  }
}
