import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateAssessmentDto {
  @ApiPropertyOptional({ example: 8.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  ethicsScore?: number;

  @ApiPropertyOptional({ example: 9.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  wisdomScore?: number;

  @ApiPropertyOptional({ example: 7.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  willpowerScore?: number;

  @ApiPropertyOptional({ example: 'Nhận xét...' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ example: '2026-03-24' })
  @IsOptional()
  @IsDateString()
  assessmentDate?: string;
}
