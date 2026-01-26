import { PartialType } from '@nestjs/mapped-types';
import { CreateTourCategoryRequestDto } from './create-tour-category.request.dto';

export class UpdateTourCategoryRequestDto extends PartialType(
  CreateTourCategoryRequestDto
) {}
