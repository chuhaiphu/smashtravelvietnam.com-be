import { Module } from '@nestjs/common';
import { TourCategoryTourService } from './tour-category-tour.service';
import { TourCategoryTourController } from './tour-category-tour.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TourCategoryTourController],
  providers: [TourCategoryTourService],
  exports: [TourCategoryTourService],
})
export class TourCategoryTourModule {}
