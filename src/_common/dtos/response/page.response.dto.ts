import { User } from 'src/prisma/generated/client';

export class PageResponseDto {
  id: string;
  title: string;
  type: string;
  description: string | null;
  content: string | null;
  country: string;
  destinations: string[];
  endpoint: string;
  visibility: string;
  videoUrl: string | null;
  videoThumbnailUrl: string | null;
  videoPosition: string;
  mainImageUrl: string | null;
  additionalImageUrls: string[];
  additionalImagesPosition: string;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Pick<User, 'id' | 'name' | 'email'> | null;
}
