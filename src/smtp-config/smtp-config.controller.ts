import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SmtpConfigService } from './smtp-config.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { UpdateSmtpConfigRequestDto } from 'src/_common/dtos/request/update-smtp-config.request.dto';
import { TestSmtpRequestDto } from 'src/_common/dtos/request/test-smtp.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { JwtValidationReturn } from 'src/_common/interfaces/interface';
import { SmtpConfigResponseDto } from 'src/_common/dtos/response/smtp-config.response.dto';

@Controller('admin/smtp-config')
@UseGuards(JwtAuthGuard)
export class SmtpConfigController {
  constructor(private readonly smtpConfigService: SmtpConfigService) {}

  @Get()
  async get(
    @CurrentUser() user: JwtValidationReturn
  ): Promise<HttpResponse<SmtpConfigResponseDto | null>> {
    const config = await this.smtpConfigService.get(user.userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'SMTP config retrieved successfully',
      data: config,
    };
  }

  @Put()
  async update(
    @CurrentUser() user: JwtValidationReturn,
    @Body() dto: UpdateSmtpConfigRequestDto
  ): Promise<HttpResponse<SmtpConfigResponseDto>> {
    const config = await this.smtpConfigService.update(user.userId, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'SMTP config updated successfully',
      data: config,
    };
  }

  @Post('test')
  async testEmail(
    @CurrentUser() user: JwtValidationReturn,
    @Body() dto: TestSmtpRequestDto
  ): Promise<HttpResponse<{ success: boolean }>> {
    const success = await this.smtpConfigService.testEmail(
      user.userId,
      dto.email
    );
    return {
      statusCode: HttpStatus.OK,
      message: success ? 'Test email sent successfully' : 'Failed to send test email',
      data: { success },
    };
  }
}
