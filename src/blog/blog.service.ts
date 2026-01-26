import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogRequestDto } from 'src/_common/dtos/request/create-blog.request.dto';
import { UpdateBlogRequestDto } from 'src/_common/dtos/request/update-blog.request.dto';
import { BlogFilterParamDto } from 'src/_common/dtos/param/blog-filter.param.dto';
import { Prisma } from 'src/prisma/generated/client';
import { BlogResponseDto } from 'src/_common/dtos/response/blog.response.dto';

@Injectable()
export class BlogService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateBlogRequestDto, userId?: string): Promise<BlogResponseDto> {
    const existing = await this.prismaService.blog.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      throw new ConflictException('Blog with this endpoint already exists');
    }

    const { categoryIds, ...blogData } = dto;

    const blog = await this.prismaService.blog.create({
      data: {
        ...blogData,
        createdByUserId: userId,
        blogCategoryBlogs: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId, index) => ({
                blogCategoryId: categoryId,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        blogCategoryBlogs: {
          include: {
            blogCategory: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return blog;
  }

  async findAll(filter: BlogFilterParamDto): Promise<BlogResponseDto[]> {
    const where: Prisma.BlogWhereInput = {};

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.visibility) {
      where.visibility = filter.visibility;
    }

    if (filter.categoryId) {
      where.blogCategoryBlogs = {
        some: { blogCategoryId: filter.categoryId },
      };
    }

    const blogs = await this.prismaService.blog.findMany({
      where,
      orderBy: {
        [filter.sortBy || 'createdAt']: filter.sortOrder || 'desc',
      },
      include: {
        blogCategoryBlogs: {
          include: {
            blogCategory: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return blogs;
  }

  async findAllPublic(filter: BlogFilterParamDto): Promise<BlogResponseDto[]> {
    return this.findAll({
      ...filter,
      visibility: 'public',
    });
  }

  async findById(id: string): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
      include: {
        blogCategoryBlogs: {
          include: {
            blogCategory: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async findByEndpoint(endpoint: string): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findUnique({
      where: { endpoint, visibility: 'public' },
      include: {
        blogCategoryBlogs: {
          include: {
            blogCategory: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async update(id: string, dto: UpdateBlogRequestDto): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (dto.endpoint && dto.endpoint !== blog.endpoint) {
      const existing = await this.prismaService.blog.findUnique({
        where: { endpoint: dto.endpoint },
      });
      if (existing) {
        throw new ConflictException('Blog with this endpoint already exists');
      }
    }

    const { categoryIds, ...blogData } = dto;

    if (categoryIds !== undefined) {
      await this.prismaService.blogCategoryBlog.deleteMany({
        where: { blogId: id },
      });

      if (categoryIds.length > 0) {
        await this.prismaService.blogCategoryBlog.createMany({
          data: categoryIds.map((categoryId, index) => ({
            blogId: id,
            blogCategoryId: categoryId,
            sortOrder: index,
          })),
        });
      }
    }

    const updatedBlog = await this.prismaService.blog.update({
      where: { id },
      data: blogData,
      include: {
        blogCategoryBlogs: {
          include: {
            blogCategory: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedBlog;
  }

  async delete(id: string) {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.prismaService.blog.delete({
      where: { id },
    });
  }

  async incrementView(id: string, ipAddress: string) {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingView = await this.prismaService.blogView.findFirst({
      where: {
        blogId: id,
        ipAddress,
        viewedAt: { gte: today },
      },
    });

    if (!existingView) {
      await this.prismaService.$transaction([
        this.prismaService.blogView.create({
          data: {
            blogId: id,
            ipAddress,
          },
        }),
        this.prismaService.blog.update({
          where: { id },
          data: { views: { increment: 1 } },
        }),
      ]);
    }

    return { success: true };
  }

  async toggleLike(id: string, ipAddress: string) {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const existingLike = await this.prismaService.blogLike.findFirst({
      where: { blogId: id, ipAddress },
    });

    if (existingLike) {
      await this.prismaService.$transaction([
        this.prismaService.blogLike.delete({
          where: { id: existingLike.id },
        }),
        this.prismaService.blog.update({
          where: { id },
          data: { likes: { decrement: 1 } },
        }),
      ]);
      return { liked: false };
    } else {
      await this.prismaService.$transaction([
        this.prismaService.blogLike.create({
          data: { blogId: id, ipAddress },
        }),
        this.prismaService.blog.update({
          where: { id },
          data: { likes: { increment: 1 } },
        }),
      ]);
      return { liked: true };
    }
  }
}
