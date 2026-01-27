import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';
import { UploadResponseDto } from 'src/_common/dtos/response/upload.response.dto';
import type {
  AuthenticatedRequest,
  HttpResponse,
} from 'src/_common/interfaces/interface';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';

@Controller('admin/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string,
  ): Promise<HttpResponse<UploadResponseDto>> {
    const result = await this.uploadService.uploadImageByCurrentUser(
      req.user.userId,
      file,
      folder,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Image uploaded successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteImage(
    @Body('path') path: string,
  ): Promise<HttpResponse<null>> {
    await this.uploadService.deleteFile(path);

    return {
      statusCode: HttpStatus.OK,
      message: 'Image deleted successfully',
      data: null,
    };
  }
}
