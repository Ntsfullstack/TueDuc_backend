import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateAssessmentDto {
  @ApiProperty({ example: 'uuid-student' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ example: 'uuid-course' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ example: 8.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  ethicsScore?: number;

  @ApiProperty({ example: 9.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  wisdomScore?: number;

  @ApiProperty({ example: 7.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  willpowerScore?: number;

  @ApiProperty({ example: 'Nhận xét...', required: false })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({ example: '2026-03-24' })
  @IsDateString()
  assessmentDate: string;
}
