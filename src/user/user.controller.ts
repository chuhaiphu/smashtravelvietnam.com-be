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
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateUserRequestDto } from 'src/_common/dtos/request/create-user.request.dto';
import { UpdateUserRequestDto } from 'src/_common/dtos/request/update-user.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { UserResponseDto } from 'src/_common/dtos/response/user.response.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(
    @Body() dto: CreateUserRequestDto
  ): Promise<HttpResponse<UserResponseDto>> {
    const user = await this.userService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  async findAll(): Promise<HttpResponse<UserResponseDto[]>> {
    const users = await this.userService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<HttpResponse<UserResponseDto>> {
    const user = await this.userService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserRequestDto
  ): Promise<HttpResponse<UserResponseDto>> {
    const user = await this.userService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.userService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'User deleted successfully',
    };
  }
}
