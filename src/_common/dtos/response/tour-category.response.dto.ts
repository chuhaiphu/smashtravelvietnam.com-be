import { TourCategory, TourCategoryTour } from 'src/prisma/generated/client';

export class TourCategoryResponseDto {
  id: string;
  title: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  videoUrl: string | null;
  videoThumbnailUrl: string | null;
  videoPosition: string;
  mainImageUrl: string | null;
  endpoint: string;
  createdAt: Date;
  updatedAt: Date;
  parent?: TourCategory | null;
  children?: TourCategory[];
  tourCategoryTours?: TourCategoryTour[];
}
