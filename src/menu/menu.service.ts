import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuRequestDto } from 'src/_common/dtos/request/create-menu.request.dto';
import { UpdateMenuRequestDto } from 'src/_common/dtos/request/update-menu.request.dto';
import { MenuResponseDto } from 'src/_common/dtos/response/menu.response.dto';

@Injectable()
export class MenuService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateMenuRequestDto): Promise<MenuResponseDto> {
    const menu = await this.prismaService.menu.create({
      data: dto,
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return menu;
  }

  async findAll(): Promise<MenuResponseDto[]> {
    const menus = await this.prismaService.menu.findMany({
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

    return menus;
  }

  async findRootMenus(): Promise<MenuResponseDto[]> {
    const menus = await this.prismaService.menu.findMany({
      where: { isRoot: true },
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

    return menus;
  }

  async findById(id: string) {
    const menu = await this.prismaService.menu.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  async update(id: string, dto: UpdateMenuRequestDto): Promise<MenuResponseDto> {
    const menu = await this.prismaService.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    const updatedMenu = await this.prismaService.menu.update({
      where: { id },
      data: dto,
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return updatedMenu;
  }

  async delete(id: string) {
    const menu = await this.prismaService.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    await this.prismaService.menu.delete({
      where: { id },
    });
  }
}
