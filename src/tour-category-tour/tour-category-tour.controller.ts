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
import { TourCategoryTourService } from './tour-category-tour.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateTourCategoryTourRequestDto } from 'src/_common/dtos/request/create-tour-category-tour.request.dto';
import { UpdateTourCategoryTourRequestDto } from 'src/_common/dtos/request/update-tour-category-tour.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { TourCategoryTourResponseDto } from 'src/_common/dtos/response/tour-category-tour.response.dto';

@Controller('admin/tour-category-tours')
@UseGuards(JwtAuthGuard)
export class TourCategoryTourController {
  constructor(
    private readonly tourCategoryTourService: TourCategoryTourService,
  ) {}

  /**
   * POST /admin/tour-category-tours
   * Create a new tour-category-tour relation
   */
  @Post()
  async create(
    @Body() dto: CreateTourCategoryTourRequestDto,
  ): Promise<HttpResponse<TourCategoryTourResponseDto>> {
    const relation = await this.tourCategoryTourService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Tour-category-tour relation created successfully',
      data: relation,
    };
  }

  /**
   * GET /admin/tour-category-tours
   * Get all tour-category-tour relations
   */
  @Get()
  async findAll(): Promise<HttpResponse<TourCategoryTourResponseDto[]>> {
    const relations = await this.tourCategoryTourService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relations retrieved successfully',
      data: relations,
    };
  }

  /**
   * GET /admin/tour-category-tours/tour/:tourId
   * Get all tour-category-tour relations for a specific tour
   */
  @Get('tour/:tourId')
  async findByTourId(
    @Param('tourId') tourId: string,
  ): Promise<HttpResponse<TourCategoryTourResponseDto[]>> {
    const relations = await this.tourCategoryTourService.findByTourId(tourId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relations retrieved successfully',
      data: relations,
    };
  }

  /**
   * GET /admin/tour-category-tours/category/:tourCategoryId
   * Get all tour-category-tour relations for a specific tour category
   */
  @Get('category/:tourCategoryId')
  async findByTourCategoryId(
    @Param('tourCategoryId') tourCategoryId: string,
  ): Promise<HttpResponse<TourCategoryTourResponseDto[]>> {
    const relations =
      await this.tourCategoryTourService.findByTourCategoryId(tourCategoryId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relations retrieved successfully',
      data: relations,
    };
  }

  /**
   * GET /admin/tour-category-tours/:id
   * Get a tour-category-tour relation by ID
   */
  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<HttpResponse<TourCategoryTourResponseDto>> {
    const relation = await this.tourCategoryTourService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relation retrieved successfully',
      data: relation,
    };
  }

  /**
   * PUT /admin/tour-category-tours/:id
   * Update a tour-category-tour relation
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTourCategoryTourRequestDto,
  ): Promise<HttpResponse<TourCategoryTourResponseDto>> {
    const relation = await this.tourCategoryTourService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relation updated successfully',
      data: relation,
    };
  }

  /**
   * DELETE /admin/tour-category-tours/tour/:tourId
   * Delete all tour-category-tour relations for a specific tour
   */
  @Delete('tour/:tourId')
  async deleteByTourId(@Param('tourId') tourId: string): Promise<HttpResponse<void>> {
    await this.tourCategoryTourService.deleteByTourId(tourId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Tour-category-tour relations deleted successfully',
    };
  }

  /**
   * DELETE /admin/tour-category-tours/category/:tourCategoryId
   * Delete all tour-category-tour relations for a specific tour category
   */
  @Delete('category/:tourCategoryId')
  async deleteByTourCategoryId(
    @Param('tourCategoryId') tourCategoryId: string,
  ): Promise<HttpResponse<void>> {
    await this.tourCategoryTourService.deleteByTourCategoryId(tourCategoryId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Tour-category-tour relations deleted successfully',
    };
  }

  /**
   * DELETE /admin/tour-category-tours/:id
   * Delete a tour-category-tour relation by ID
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.tourCategoryTourService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Tour-category-tour relation deleted successfully',
    };
  }
}
