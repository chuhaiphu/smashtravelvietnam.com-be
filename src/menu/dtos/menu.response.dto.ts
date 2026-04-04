import { Menu } from 'src/prisma/generated/client';

export class MenuResponseDto {
  id: string;
  title: string;
  description: string | null;
  targetType: string;
  targetId: string | null;
  customUrl: string | null;
  isRoot: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  parent?: Menu | null;
  children?: Menu[];
}
