import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogCategoryRequestDto } from 'src/_common/dtos/request/create-blog-category.request.dto';
import { UpdateBlogCategoryRequestDto } from 'src/_common/dtos/request/update-blog-category.request.dto';
import { BlogCategoryResponseDto } from 'src/_common/dtos/response/blog-category.response.dto';

@Injectable()
export class BlogCategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateBlogCategoryRequestDto): Promise<BlogCategoryResponseDto> {
    const existing = await this.prismaService.blogCategory.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      throw new ConflictException('Category with this endpoint already exists');
    }

    const category = await this.prismaService.blogCategory.create({
      data: dto,
      include: {
        parent: true,
        children: true,
      },
    });

    return category;
  }

  async findAll(): Promise<BlogCategoryResponseDto[]> {
    const categories = await this.prismaService.blogCategory.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    return categories;
  }

  async findById(id: string): Promise<BlogCategoryResponseDto> {
    const category = await this.prismaService.blogCategory.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        blogCategoryBlogs: {
          include: {
            blog: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findByEndpoint(endpoint: string): Promise<BlogCategoryResponseDto> {
    const category = await this.prismaService.blogCategory.findUnique({
      where: { endpoint },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        blogCategoryBlogs: {
          where: {
            blog: {
              visibility: 'public',
            },
          },
          include: {
            blog: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateBlogCategoryRequestDto): Promise<BlogCategoryResponseDto> {
    const category = await this.prismaService.blogCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.endpoint && dto.endpoint !== category.endpoint) {
      const existing = await this.prismaService.blogCategory.findUnique({
        where: { endpoint: dto.endpoint },
      });
      if (existing) {
        throw new ConflictException('Category with this endpoint already exists');
      }
    }

    const updatedCategory = await this.prismaService.blogCategory.update({
      where: { id },
      data: dto,
      include: {
        parent: true,
        children: true,
      },
    });

    return updatedCategory;
  }

  async delete(id: string) {
    const category = await this.prismaService.blogCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.prismaService.blogCategory.delete({
      where: { id },
    });
  }
}
