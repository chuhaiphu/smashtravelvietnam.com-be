import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePageRequestDto } from 'src/_common/dtos/request/create-page.request.dto';
import { UpdatePageRequestDto } from 'src/_common/dtos/request/update-page.request.dto';
import { PageResponseDto } from 'src/_common/dtos/response/page.response.dto';

@Injectable()
export class PageService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreatePageRequestDto, userId?: string): Promise<PageResponseDto> {
    const existing = await this.prismaService.page.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      throw new ConflictException('Page with this endpoint already exists');
    }

    const page = await this.prismaService.page.create({
      data: {
        ...dto,
        createdByUserId: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return page;
  }

  async findAll(): Promise<PageResponseDto[]> {
    const pages = await this.prismaService.page.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return pages;
  }

  async findById(id: string): Promise<PageResponseDto> {
    const page = await this.prismaService.page.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async findByEndpoint(endpoint: string) {
    const page = await this.prismaService.page.findUnique({
      where: { endpoint, visibility: 'public' },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async update(id: string, dto: UpdatePageRequestDto): Promise<PageResponseDto> {
    const page = await this.prismaService.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (dto.endpoint && dto.endpoint !== page.endpoint) {
      const existing = await this.prismaService.page.findUnique({
        where: { endpoint: dto.endpoint },
      });
      if (existing) {
        throw new ConflictException('Page with this endpoint already exists');
      }
    }

    const updatedPage = await this.prismaService.page.update({
      where: { id },
      data: dto,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedPage;
  }

  async delete(id: string) {
    const page = await this.prismaService.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    await this.prismaService.page.delete({
      where: { id },
    });
  }
}
