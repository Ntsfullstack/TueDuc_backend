import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LinkParentDto {
  @ApiProperty({ example: 'uuid-of-parent-user' })
  @IsUUID()
  parentId: string;
}
