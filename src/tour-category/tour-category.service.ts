import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTourCategoryRequestDto } from 'src/_common/dtos/request/create-tour-category.request.dto';
import { UpdateTourCategoryRequestDto } from 'src/_common/dtos/request/update-tour-category.request.dto';
import { TourCategoryResponseDto } from 'src/_common/dtos/response/tour-category.response.dto';

@Injectable()
export class TourCategoryService {
  constructor(private prismaService: PrismaService) { }

  async create(dto: CreateTourCategoryRequestDto): Promise<TourCategoryResponseDto> {
    const existing = await this.prismaService.tourCategory.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      throw new ConflictException('Category with this endpoint already exists');
    }

    const category = await this.prismaService.tourCategory.create({
      data: dto,
      include: {
        parent: true,
        children: true,
      },
    });

    return category;
  }

  async findAll(): Promise<TourCategoryResponseDto[]> {
    const categories = await this.prismaService.tourCategory.findMany({
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

  async findById(id: string): Promise<TourCategoryResponseDto> {
    const category = await this.prismaService.tourCategory.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        tourCategoryTours: {
          include: {
            tour: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findByEndpoint(endpoint: string): Promise<TourCategoryResponseDto> {
    const category = await this.prismaService.tourCategory.findUnique({
      where: { endpoint },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        tourCategoryTours: {
          where: {
            tour: {
              visibility: 'public',
            },
          },
          include: {
            tour: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateTourCategoryRequestDto): Promise<TourCategoryResponseDto> {
    const category = await this.prismaService.tourCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.endpoint && dto.endpoint !== category.endpoint) {
      const existing = await this.prismaService.tourCategory.findUnique({
        where: { endpoint: dto.endpoint },
      });
      if (existing) {
        throw new ConflictException('Category with this endpoint already exists');
      }
    }

    const updatedCategory = await this.prismaService.tourCategory.update({
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
    const category = await this.prismaService.tourCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.prismaService.tourCategory.delete({
      where: { id },
    });
  }
}
