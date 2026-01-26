import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuRequestDto } from './create-menu.request.dto';

export class UpdateMenuRequestDto extends PartialType(CreateMenuRequestDto) {}
