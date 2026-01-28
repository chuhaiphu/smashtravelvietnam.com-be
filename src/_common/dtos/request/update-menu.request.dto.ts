import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMenuRequestDto } from './create-menu.request.dto';

export class UpdateMenuRequestDto implements Partial<CreateMenuRequestDto> {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  customUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  targetType?: string;

  @IsString()
  @IsOptional()
  targetId?: string;

  @IsBoolean()
  @IsOptional()
  isRoot?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;
}
