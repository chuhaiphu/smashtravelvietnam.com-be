import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogCategoryBlogRequestDto } from 'src/_common/dtos/request/create-blog-category-blog.request.dto';
import { UpdateBlogCategoryBlogRequestDto } from 'src/_common/dtos/request/update-blog-category-blog.request.dto';
import { BlogCategoryBlogResponseDto } from 'src/_common/dtos/response/blog-category-blog.response.dto';
import { Prisma } from 'src/prisma/generated/client';

@Injectable()
export class BlogCategoryBlogService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Create a new blog-category-blog relation
   * Validates that both blogCategoryId and blogId are provided
   * Throws ConflictException if relation already exists (unique constraint)
   */
  async create(
    dto: CreateBlogCategoryBlogRequestDto,
  ): Promise<BlogCategoryBlogResponseDto> {
    try {
      const relation = await this.prismaService.blogCategoryBlog.create({
        data: {
          blogCategoryId: dto.blogCategoryId,
          blogId: dto.blogId,
          sortOrder: dto.sortOrder ?? 0,
        },
        include: {
          blogCategory: {
            include: {
              parent: true,
              children: true,
            },
          },
          blog: {
            include: {
              createdBy: true,
              blogCategoryBlogs: true,
            },
          },
        },
      });

      return relation;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Relation between this blog category and blog already exists',
        );
      }
      throw error;
    }
  }

  /**
   * Find a blog-category-blog relation by ID
   * Returns the relation with included blogCategory and blog data
   * Throws NotFoundException if relation not found
   */
  async findById(id: string): Promise<BlogCategoryBlogResponseDto> {
    const relation = await this.prismaService.blogCategoryBlog.findUnique({
      where: { id },
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    if (!relation) {
      throw new NotFoundException('Blog-category-blog relation not found');
    }

    return relation;
  }

  /**
   * Find all blog-category-blog relations for a specific blog
   * Returns relations ordered by sortOrder in ascending order
   */
  async findByBlogId(blogId: string): Promise<BlogCategoryBlogResponseDto[]> {
    const relations = await this.prismaService.blogCategoryBlog.findMany({
      where: { blogId },
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    return relations;
  }

  /**
   * Find all blog-category-blog relations for a specific blog category
   * Returns relations ordered by sortOrder in ascending order
   */
  async findByBlogCategoryId(
    blogCategoryId: string,
  ): Promise<BlogCategoryBlogResponseDto[]> {
    const relations = await this.prismaService.blogCategoryBlog.findMany({
      where: { blogCategoryId },
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    return relations;
  }

  /**
   * Find all blog-category-blog relations
   */
  async findAll(): Promise<BlogCategoryBlogResponseDto[]> {
    const relations = await this.prismaService.blogCategoryBlog.findMany({
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    return relations;
  }

  /**
   * Update a blog-category-blog relation
   * Currently only allows modification of sortOrder field
   * Throws NotFoundException if relation not found
   */
  async update(
    id: string,
    dto: UpdateBlogCategoryBlogRequestDto,
  ): Promise<BlogCategoryBlogResponseDto> {
    const relation = await this.prismaService.blogCategoryBlog.findUnique({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Blog-category-blog relation not found');
    }

    const updatedRelation = await this.prismaService.blogCategoryBlog.update({
      where: { id },
      data: {
        sortOrder: dto.sortOrder,
      },
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    return updatedRelation;
  }

  /**
   * Delete a blog-category-blog relation by ID
   * Throws NotFoundException if relation not found
   */
  async delete(id: string): Promise<void> {
    const relation = await this.prismaService.blogCategoryBlog.findUnique({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Blog-category-blog relation not found');
    }

    await this.prismaService.blogCategoryBlog.delete({
      where: { id },
    });
  }

  /**
   * Delete all blog-category-blog relations for a specific blog
   * Removes all relations associated with the given blogId
   */
  async deleteByBlogId(blogId: string): Promise<void> {
    await this.prismaService.blogCategoryBlog.deleteMany({
      where: { blogId },
    });
  }

  /**
   * Delete all blog-category-blog relations for a specific blog category
   * Removes all relations associated with the given blogCategoryId
   */
  async deleteByBlogCategoryId(blogCategoryId: string): Promise<void> {
    await this.prismaService.blogCategoryBlog.deleteMany({
      where: { blogCategoryId },
    });
  }
}
