import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './_core/configs/app.config';
import { AuthModule } from './auth/auth.module';
import { AuthExceptionFilter } from './_core/filters/auth-exception.filter';
import { AppExceptionFilter } from './_core/filters/app-exception.filter';
import { UserModule } from './user/user.module';
import { TourModule } from './tour/tour.module';
import { TourCategoryModule } from './tour-category/tour-category.module';
import { BlogModule } from './blog/blog.module';
import { BlogCategoryModule } from './blog-category/blog-category.module';
import { PageModule } from './page/page.module';
import { MenuModule } from './menu/menu.module';
import { BookingModule } from './booking/booking.module';
import { CustomTourRequestModule } from './custom-tour-request/custom-tour-request.module';
import { CustomerContactModule } from './customer-contact/customer-contact.module';
import { MediaModule } from './media/media.module';
import { UploadModule } from './upload/upload.module';
import { AppConfigModule } from './app-config/app-config.module';
import { SmtpConfigModule } from './smtp-config/smtp-config.module';
import { ActionLogModule } from './action-log/action-log.module';
import { MailModule } from './mail/mail.module';
import { SectionUIModule } from './section-ui/section-ui.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
    AuthModule,
    UserModule,
    TourModule,
    TourCategoryModule,
    BlogModule,
    BlogCategoryModule,
    PageModule,
    MenuModule,
    BookingModule,
    CustomTourRequestModule,
    CustomerContactModule,
    MediaModule,
    UploadModule,
    AppConfigModule,
    SmtpConfigModule,
    ActionLogModule,
    MailModule,
    SectionUIModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthExceptionFilter, AppExceptionFilter],
})
export class AppModule {}
