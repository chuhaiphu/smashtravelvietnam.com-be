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
import { TourCategoryService } from './tour-category.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateTourCategoryRequestDto } from 'src/_common/dtos/request/create-tour-category.request.dto';
import { UpdateTourCategoryRequestDto } from 'src/_common/dtos/request/update-tour-category.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { TourCategoryResponseDto } from 'src/_common/dtos/response/tour-category.response.dto';

@Controller('tour-categories')
export class TourCategoryController {
  constructor(private readonly tourCategoryService: TourCategoryService) {}

  // ==================== PUBLIC ROUTES ====================

  @Get()
  async findAllPublic(): Promise<HttpResponse<TourCategoryResponseDto[]>> {
    const categories = await this.tourCategoryService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour categories retrieved successfully',
      data: categories,
    };
  }

  @Get(':endpoint')
  async findByEndpoint(
    @Param('endpoint') endpoint: string
  ): Promise<HttpResponse<TourCategoryResponseDto>> {
    const category = await this.tourCategoryService.findByEndpoint(endpoint);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour category retrieved successfully',
      data: category,
    };
  }

  // ==================== ADMIN ROUTES ====================

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateTourCategoryRequestDto
  ): Promise<HttpResponse<TourCategoryResponseDto>> {
    const category = await this.tourCategoryService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Tour category created successfully',
      data: category,
    };
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<HttpResponse<TourCategoryResponseDto[]>> {
    const categories = await this.tourCategoryService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour categories retrieved successfully',
      data: categories,
    };
  }

  @Get('admin/available-sort-orders/:parentId')
  @UseGuards(JwtAuthGuard)
  async findAvailableSortOrders(
    @Param('parentId') parentId: string
  ): Promise<HttpResponse<number[]>> {
    const sortOrders = await this.tourCategoryService.findAvailableSortOrders(parentId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Available sort orders retrieved successfully',
      data: sortOrders,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<TourCategoryResponseDto>> {
    const category = await this.tourCategoryService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour category retrieved successfully',
      data: category,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTourCategoryRequestDto
  ): Promise<HttpResponse<TourCategoryResponseDto>> {
    const category = await this.tourCategoryService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour category updated successfully',
      data: category,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.tourCategoryService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Tour category deleted successfully',
    };
  }
}
