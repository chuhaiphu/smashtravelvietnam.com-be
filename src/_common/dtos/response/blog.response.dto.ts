import { BlogCategoryBlog, User } from 'src/prisma/generated/client';

export class BlogResponseDto {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  country: string;
  destinations: string[];
  endpoint: string;
  visibility: string;
  sortOrder: number;
  videoUrl: string | null;
  videoThumbnailUrl: string | null;
  videoPosition: string;
  mainImageUrl: string | null;
  additionalImageUrls: string[];
  additionalImagesPosition: string;
  likes: number;
  views: number;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
  blogCategoryBlogs?: BlogCategoryBlog[];
  createdBy?: Pick<User, 'id' | 'name' | 'email'> | null;
}
