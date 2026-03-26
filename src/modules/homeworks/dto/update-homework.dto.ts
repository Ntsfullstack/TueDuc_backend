import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { HomeworkType } from '../entities/homework.entity';

export class UpdateHomeworkDto {
  @ApiPropertyOptional({ example: 'Bài tập tuần 1' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: HomeworkType })
  @IsOptional()
  @IsEnum(HomeworkType)
  type?: HomeworkType;

  @ApiPropertyOptional({ example: '2026-03-30T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
