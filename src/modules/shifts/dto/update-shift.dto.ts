import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateShiftDto {
  @ApiPropertyOptional({ example: 'Ca 1' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '08:00:00' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  startTime?: string;

  @ApiPropertyOptional({ example: '10:00:00' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  endTime?: string;
}
