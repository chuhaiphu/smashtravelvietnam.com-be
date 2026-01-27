import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BlogCategoryBlogService } from './blog-category-blog.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateBlogCategoryBlogRequestDto } from 'src/_common/dtos/request/create-blog-category-blog.request.dto';
import { UpdateBlogCategoryBlogRequestDto } from 'src/_common/dtos/request/update-blog-category-blog.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { BlogCategoryBlogResponseDto } from 'src/_common/dtos/response/blog-category-blog.response.dto';

@Controller('admin/blog-category-blogs')
@UseGuards(JwtAuthGuard)
export class BlogCategoryBlogController {
  constructor(
    private readonly blogCategoryBlogService: BlogCategoryBlogService,
  ) {}

  /**
   * POST /admin/blog-category-blogs
   * Create a new blog-category-blog relation
   */
  @Post()
  async create(
    @Body() dto: CreateBlogCategoryBlogRequestDto,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto>> {
    const relation = await this.blogCategoryBlogService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Blog-category-blog relation created successfully',
      data: relation,
    };
  }

  /**
   * GET /admin/blog-category-blogs
   * Get all blog-category-blog relations
   */
  @Get()
  async findAll(): Promise<HttpResponse<BlogCategoryBlogResponseDto[]>> {
    const relations = await this.blogCategoryBlogService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relations retrieved successfully',
      data: relations,
    };
  }

  /**
   * GET /admin/blog-category-blogs/blog/:blogId
   * Get all blog-category-blog relations for a specific blog
   */
  @Get('blog/:blogId')
  async findByBlogId(
    @Param('blogId') blogId: string,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto[]>> {
    const relations = await this.blogCategoryBlogService.findByBlogId(blogId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relations retrieved successfully',
      data: relations,
    };
  }

  /**
   * GET /admin/blog-category-blogs/category/:blogCategoryId
   * Get all blog-category-blog relations for a specific blog category
   */
  @Get('category/:blogCategoryId')
  async findByBlogCategoryId(
    @Param('blogCategoryId') blogCategoryId: string,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto[]>> {
    const relations =
      await this.blogCategoryBlogService.findByBlogCategoryId(blogCategoryId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relations retrieved successfully',
      data: relations,
    };
  }

  /**
   * GET /admin/blog-category-blogs/:id
   * Get a blog-category-blog relation by ID
   */
  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto>> {
    const relation = await this.blogCategoryBlogService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relation retrieved successfully',
      data: relation,
    };
  }

  /**
   * PUT /admin/blog-category-blogs/:id
   * Update a blog-category-blog relation
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogCategoryBlogRequestDto,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto>> {
    const relation = await this.blogCategoryBlogService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relation updated successfully',
      data: relation,
    };
  }

  /**
   * DELETE /admin/blog-category-blogs/blog/:blogId
   * Delete all blog-category-blog relations for a specific blog
   */
  @Delete('blog/:blogId')
  async deleteByBlogId(@Param('blogId') blogId: string): Promise<HttpResponse<void>> {
    await this.blogCategoryBlogService.deleteByBlogId(blogId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Blog-category-blog relations deleted successfully',
    };
  }

  /**
   * DELETE /admin/blog-category-blogs/category/:blogCategoryId
   * Delete all blog-category-blog relations for a specific blog category
   */
  @Delete('category/:blogCategoryId')
  async deleteByBlogCategoryId(
    @Param('blogCategoryId') blogCategoryId: string,
  ): Promise<HttpResponse<void>> {
    await this.blogCategoryBlogService.deleteByBlogCategoryId(blogCategoryId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Blog-category-blog relations deleted successfully',
    };
  }

  /**
   * DELETE /admin/blog-category-blogs/:id
   * Delete a blog-category-blog relation by ID
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.blogCategoryBlogService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Blog-category-blog relation deleted successfully',
    };
  }
}
