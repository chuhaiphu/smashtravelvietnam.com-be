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
import { PageService } from './page.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreatePageRequestDto } from 'src/_common/dtos/request/create-page.request.dto';
import { UpdatePageRequestDto } from 'src/_common/dtos/request/update-page.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { JwtValidationReturn } from 'src/_common/interfaces/interface';
import { PageResponseDto } from 'src/_common/dtos/response/page.response.dto';

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  // ==================== PUBLIC ROUTES ====================

  // ==================== ADMIN ROUTES ====================

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreatePageRequestDto,
    @CurrentUser() user: JwtValidationReturn
  ): Promise<HttpResponse<PageResponseDto>> {
    const page = await this.pageService.create(dto, user.userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Page created successfully',
      data: page,
    };
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<HttpResponse<PageResponseDto[]>> {
    const pages = await this.pageService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Pages retrieved successfully',
      data: pages,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<PageResponseDto>> {
    const page = await this.pageService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Page retrieved successfully',
      data: page,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePageRequestDto
  ): Promise<HttpResponse<PageResponseDto>> {
    const page = await this.pageService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Page updated successfully',
      data: page,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.pageService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Page deleted successfully',
    };
  }

  @Get(':endpoint')
  async findByEndpoint(
    @Param('endpoint') endpoint: string
  ): Promise<HttpResponse<PageResponseDto>> {
    const page = await this.pageService.findByEndpoint(endpoint);
    return {
      statusCode: HttpStatus.OK,
      message: 'Page retrieved successfully',
      data: page,
    };
  }
}
