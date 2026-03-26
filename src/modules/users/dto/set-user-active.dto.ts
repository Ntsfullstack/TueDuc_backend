import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SetUserActiveDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}
