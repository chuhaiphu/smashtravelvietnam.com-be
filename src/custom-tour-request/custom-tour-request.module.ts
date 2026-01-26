import { Module } from '@nestjs/common';
import { CustomTourRequestService } from './custom-tour-request.service';
import { CustomTourRequestController } from './custom-tour-request.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [CustomTourRequestController],
  providers: [CustomTourRequestService],
  exports: [CustomTourRequestService],
})
export class CustomTourRequestModule {}
