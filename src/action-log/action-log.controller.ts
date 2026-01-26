import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActionLogService } from './action-log.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { ActionLogResponseDto } from 'src/_common/dtos/response/action-log.response.dto';

@Controller('admin/action-logs')
@UseGuards(JwtAuthGuard)
export class ActionLogController {
  constructor(private readonly actionLogService: ActionLogService) {}

  @Get()
  async findAll(
    @Query('entityType') entityType?: string,
    @Query('userId') userId?: string
  ): Promise<HttpResponse<ActionLogResponseDto[]>> {
    const result = await this.actionLogService.findAll(entityType, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Action logs retrieved successfully',
      data: result,
    };
  }

  @Get(':entityType/:entityId')
  async findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string
  ): Promise<HttpResponse<ActionLogResponseDto[]>> {
    const logs = await this.actionLogService.findByEntity(entityType, entityId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Action logs retrieved successfully',
      data: logs,
    };
  }
}
