import { Module } from '@nestjs/common';
import { TourCategoryService } from './tour-category.service';
import { TourCategoryController } from './tour-category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TourCategoryController],
  providers: [TourCategoryService],
  exports: [TourCategoryService],
})
export class TourCategoryModule {}
