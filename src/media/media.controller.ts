import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateMediaRequestDto } from 'src/_common/dtos/request/create-media.request.dto';
import { UpdateMediaRequestDto } from 'src/_common/dtos/request/update-media.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { MediaResponseDto } from 'src/_common/dtos/response/media.response.dto';

@Controller('admin/media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  async create(
    @Body() dto: CreateMediaRequestDto
  ): Promise<HttpResponse<unknown>> {
    const media = await this.mediaService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Media created successfully',
      data: media,
    };
  }

  @Get()
  async findAll(@Query('folder') folder?: string): Promise<HttpResponse<MediaResponseDto[]>> {
    const media = await this.mediaService.findAll(folder);
    return {
      statusCode: HttpStatus.OK,
      message: 'Media retrieved successfully',
      data: media,
    };
  }

  @Get('folders')
  async getFolders(): Promise<HttpResponse<unknown>> {
    const folders = await this.mediaService.getFolders();
    return {
      statusCode: HttpStatus.OK,
      message: 'Folders retrieved successfully',
      data: folders,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<HttpResponse<MediaResponseDto>> {
    const media = await this.mediaService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Media retrieved successfully',
      data: media,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaRequestDto
  ): Promise<HttpResponse<MediaResponseDto>> {
    const media = await this.mediaService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Media updated successfully',
      data: media,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.mediaService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Media deleted successfully',
    };
  }
}
