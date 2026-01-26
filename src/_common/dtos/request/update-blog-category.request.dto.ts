import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogCategoryRequestDto } from './create-blog-category.request.dto';

export class UpdateBlogCategoryRequestDto extends PartialType(
  CreateBlogCategoryRequestDto
) {}
