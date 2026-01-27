import { SectionUICredentialsResponseDto } from './section-ui-credentials.response.dto';

export class DynamicSectionUIResponseDto {
  id: string;
  position: number;
  sectionUICredentialsId: string | null;
  sectionUICredentials: SectionUICredentialsResponseDto | null;
  properties: object | null;
  createdAt: Date;
  updatedAt: Date;
}
