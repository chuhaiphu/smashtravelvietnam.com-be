import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateSectionUICredentialsRequestDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  componentKey: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsObject()
  @IsNotEmpty()
  propertyFormat: object;
}
