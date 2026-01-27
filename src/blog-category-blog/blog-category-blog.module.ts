import { Module } from '@nestjs/common';
import { BlogCategoryBlogService } from './blog-category-blog.service';
import { BlogCategoryBlogController } from './blog-category-blog.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BlogCategoryBlogController],
  providers: [BlogCategoryBlogService],
  exports: [BlogCategoryBlogService],
})
export class BlogCategoryBlogModule {}
