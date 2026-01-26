import { BlogCategory, BlogCategoryBlog } from 'src/prisma/generated/client';

export class BlogCategoryResponseDto {
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
  parent?: BlogCategory | null;
  children?: BlogCategory[];
  blogCategoryBlogs?: BlogCategoryBlog[];
}
