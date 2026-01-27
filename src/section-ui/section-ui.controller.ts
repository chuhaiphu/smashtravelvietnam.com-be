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
import { SectionUIService } from './section-ui.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { CreateSectionUICredentialsRequestDto } from 'src/_common/dtos/request/create-section-ui-credentials.request.dto';
import { UpdateSectionUICredentialsRequestDto } from 'src/_common/dtos/request/update-section-ui-credentials.request.dto';
import { SectionUICredentialsResponseDto } from 'src/_common/dtos/response/section-ui-credentials.response.dto';
import { CreateDynamicSectionUIRequestDto } from 'src/_common/dtos/request/create-dynamic-section-ui.request.dto';
import { UpdateDynamicSectionUIRequestDto } from 'src/_common/dtos/request/update-dynamic-section-ui.request.dto';
import { DynamicSectionUIResponseDto } from 'src/_common/dtos/response/dynamic-section-ui.response.dto';

@Controller('admin/section-ui')
@UseGuards(JwtAuthGuard)
export class SectionUIController {
  constructor(private readonly sectionUIService: SectionUIService) {}

  // ==================== SectionUICredentials Endpoints ====================

  @Post('credentials')
  async createCredential(
    @Body() dto: CreateSectionUICredentialsRequestDto,
  ): Promise<HttpResponse<SectionUICredentialsResponseDto>> {
    const credential = await this.sectionUIService.createSectionUICredentials(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Section UI Credential created successfully',
      data: credential,
    };
  }

  @Get('credentials')
  async findAllCredentials(): Promise<
    HttpResponse<SectionUICredentialsResponseDto[]>
  > {
    const credentials = await this.sectionUIService.findAllSectionUICredentials();
    return {
      statusCode: HttpStatus.OK,
      message: 'Section UI Credentials retrieved successfully',
      data: credentials,
    };
  }

  @Get('credentials/types/distinct')
  async getDistinctTypes(): Promise<HttpResponse<string[]>> {
    const types = await this.sectionUIService.getDistinctSectionUICredentialsTypes();
    return {
      statusCode: HttpStatus.OK,
      message: 'Distinct types retrieved successfully',
      data: types,
    };
  }

  @Get('credentials/code/:code')
  async findCredentialByCode(
    @Param('code') code: string,
  ): Promise<HttpResponse<SectionUICredentialsResponseDto>> {
    const credential = await this.sectionUIService.findSectionUICredentialsByCode(code);
    return {
      statusCode: HttpStatus.OK,
      message: 'Section UI Credential retrieved successfully',
      data: credential,
    };
  }

  @Get('credentials/type/:type')
  async findCredentialsByType(
    @Param('type') type: string,
  ): Promise<HttpResponse<SectionUICredentialsResponseDto[]>> {
    const credentials = await this.sectionUIService.findSectionUICredentialsByType(type);
    return {
      statusCode: HttpStatus.OK,
      message: 'Section UI Credentials retrieved successfully',
      data: credentials,
    };
  }

  @Get('credentials/:id')
  async findCredentialById(
    @Param('id') id: string,
  ): Promise<HttpResponse<SectionUICredentialsResponseDto>> {
    const credential = await this.sectionUIService.findSectionUICredentialsById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Section UI Credential retrieved successfully',
      data: credential,
    };
  }

  @Put('credentials/:id')
  async updateCredential(
    @Param('id') id: string,
    @Body() dto: UpdateSectionUICredentialsRequestDto,
  ): Promise<HttpResponse<SectionUICredentialsResponseDto>> {
    const credential = await this.sectionUIService.updateSectionUICredentials(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Section UI Credential updated successfully',
      data: credential,
    };
  }

  @Delete('credentials/:id')
  async deleteCredential(
    @Param('id') id: string,
  ): Promise<HttpResponse<void>> {
    await this.sectionUIService.deleteSectionUICredentials(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Section UI Credential deleted successfully',
    };
  }

  // ==================== DynamicSectionUI Endpoints ====================

  @Post('sections')
  async createSection(
    @Body() dto: CreateDynamicSectionUIRequestDto,
  ): Promise<HttpResponse<DynamicSectionUIResponseDto>> {
    const section = await this.sectionUIService.createSectionUI(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Dynamic Section UI created successfully',
      data: section,
    };
  }

  @Get('sections')
  async findAllSections(): Promise<HttpResponse<DynamicSectionUIResponseDto[]>> {
    const sections = await this.sectionUIService.findAllSectionUIs();
    return {
      statusCode: HttpStatus.OK,
      message: 'Dynamic Section UIs retrieved successfully',
      data: sections,
    };
  }

  @Get('sections/positions/used')
  async getUsedPositions(): Promise<HttpResponse<number[]>> {
    const positions = await this.sectionUIService.getUsedSectionUIPositions();
    return {
      statusCode: HttpStatus.OK,
      message: 'Used positions retrieved successfully',
      data: positions,
    };
  }

  @Get('sections/position/:position')
  async findSectionByPosition(
    @Param('position') position: string,
  ): Promise<HttpResponse<DynamicSectionUIResponseDto>> {
    const section = await this.sectionUIService.findSectionUIByPosition(
      parseInt(position, 10),
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Dynamic Section UI retrieved successfully',
      data: section,
    };
  }

  @Get('sections/type/:type')
  async findSectionsByType(
    @Param('type') type: string,
  ): Promise<HttpResponse<DynamicSectionUIResponseDto[]>> {
    const sections = await this.sectionUIService.findSectionUIsByType(type);
    return {
      statusCode: HttpStatus.OK,
      message: 'Dynamic Section UIs retrieved successfully',
      data: sections,
    };
  }

  @Get('sections/:id')
  async findSectionById(
    @Param('id') id: string,
  ): Promise<HttpResponse<DynamicSectionUIResponseDto>> {
    const section = await this.sectionUIService.findSectionUIById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Dynamic Section UI retrieved successfully',
      data: section,
    };
  }

  @Put('sections/:id')
  async updateSection(
    @Param('id') id: string,
    @Body() dto: UpdateDynamicSectionUIRequestDto,
  ): Promise<HttpResponse<DynamicSectionUIResponseDto>> {
    const section = await this.sectionUIService.updateSectionUI(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Dynamic Section UI updated successfully',
      data: section,
    };
  }

  @Delete('sections/:id')
  async deleteSection(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.sectionUIService.deleteSectionUI(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Dynamic Section UI deleted successfully',
    };
  }
}
