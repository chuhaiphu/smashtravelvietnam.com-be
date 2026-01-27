import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TourCategoryCustomTourRequestService } from './tour-category-custom-tour-request.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateTourCategoryCustomTourRequestRequestDto } from 'src/_common/dtos/request/create-tour-category-custom-tour-request.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { TourCategoryCustomTourRequestResponseDto } from 'src/_common/dtos/response/tour-category-custom-tour-request.response.dto';

@Controller('admin/tour-category-custom-tour-requests')
@UseGuards(JwtAuthGuard)
export class TourCategoryCustomTourRequestController {
  constructor(
    private readonly tourCategoryCustomTourRequestService: TourCategoryCustomTourRequestService,
  ) {}

  /**
   * POST /admin/tour-category-custom-tour-requests
   * Create a new tour-category-custom-tour-request relation
   */
  @Post()
  async create(
    @Body() dto: CreateTourCategoryCustomTourRequestRequestDto,
  ): Promise<HttpResponse<TourCategoryCustomTourRequestResponseDto>> {
    const relation =
      await this.tourCategoryCustomTourRequestService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message:
        'Tour-category-custom-tour-request relation created successfully',
      data: relation,
    };
  }

  /**
   * GET /admin/tour-category-custom-tour-requests
   * Get all tour-category-custom-tour-request relations
   */
  @Get()
  async findAll(): Promise<
    HttpResponse<TourCategoryCustomTourRequestResponseDto[]>
  > {
    const relations =
      await this.tourCategoryCustomTourRequestService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message:
        'Tour-category-custom-tour-request relations retrieved successfully',
      data: relations,
    };
  }

  /**
   * GET /admin/tour-category-custom-tour-requests/request/:customTourRequestId
   * Get all tour-category-custom-tour-request relations for a specific custom tour request
   */
  @Get('request/:customTourRequestId')
  async findByCustomTourRequestId(
    @Param('customTourRequestId') customTourRequestId: string,
  ): Promise<HttpResponse<TourCategoryCustomTourRequestResponseDto[]>> {
    const relations =
      await this.tourCategoryCustomTourRequestService.findByCustomTourRequestId(
        customTourRequestId,
      );
    return {
      statusCode: HttpStatus.OK,
      message:
        'Tour-category-custom-tour-request relations retrieved successfully',
      data: relations,
    };
  }

  /**
   * GET /admin/tour-category-custom-tour-requests/category/:tourCategoryId
   * Get all tour-category-custom-tour-request relations for a specific tour category
   */
  @Get('category/:tourCategoryId')
  async findByTourCategoryId(
    @Param('tourCategoryId') tourCategoryId: string,
  ): Promise<HttpResponse<TourCategoryCustomTourRequestResponseDto[]>> {
    const relations =
      await this.tourCategoryCustomTourRequestService.findByTourCategoryId(
        tourCategoryId,
      );
    return {
      statusCode: HttpStatus.OK,
      message:
        'Tour-category-custom-tour-request relations retrieved successfully',
      data: relations,
    };
  }

  /**
   * GET /admin/tour-category-custom-tour-requests/:id
   * Get a tour-category-custom-tour-request relation by ID
   */
  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<HttpResponse<TourCategoryCustomTourRequestResponseDto>> {
    const relation =
      await this.tourCategoryCustomTourRequestService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message:
        'Tour-category-custom-tour-request relation retrieved successfully',
      data: relation,
    };
  }

  /**
   * DELETE /admin/tour-category-custom-tour-requests/request/:customTourRequestId
   * Delete all tour-category-custom-tour-request relations for a specific custom tour request
   */
  @Delete('request/:customTourRequestId')
  async deleteByCustomTourRequestId(
    @Param('customTourRequestId') customTourRequestId: string,
  ): Promise<HttpResponse<void>> {
    await this.tourCategoryCustomTourRequestService.deleteByCustomTourRequestId(
      customTourRequestId,
    );
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message:
        'Tour-category-custom-tour-request relations deleted successfully',
    };
  }

  /**
   * DELETE /admin/tour-category-custom-tour-requests/category/:tourCategoryId
   * Delete all tour-category-custom-tour-request relations for a specific tour category
   */
  @Delete('category/:tourCategoryId')
  async deleteByTourCategoryId(
    @Param('tourCategoryId') tourCategoryId: string,
  ): Promise<HttpResponse<void>> {
    await this.tourCategoryCustomTourRequestService.deleteByTourCategoryId(
      tourCategoryId,
    );
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message:
        'Tour-category-custom-tour-request relations deleted successfully',
    };
  }

  /**
   * DELETE /admin/tour-category-custom-tour-requests/:id
   * Delete a tour-category-custom-tour-request relation by ID
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.tourCategoryCustomTourRequestService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message:
        'Tour-category-custom-tour-request relation deleted successfully',
    };
  }
}
