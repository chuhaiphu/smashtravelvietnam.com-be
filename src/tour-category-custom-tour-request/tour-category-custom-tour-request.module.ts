import { Module } from '@nestjs/common';
import { TourCategoryCustomTourRequestService } from './tour-category-custom-tour-request.service';
import { TourCategoryCustomTourRequestController } from './tour-category-custom-tour-request.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TourCategoryCustomTourRequestController],
  providers: [TourCategoryCustomTourRequestService],
  exports: [TourCategoryCustomTourRequestService],
})
export class TourCategoryCustomTourRequestModule {}
