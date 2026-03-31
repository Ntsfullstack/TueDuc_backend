import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ClassStatus } from '../entities/class.entity';

export class ListClassQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: ClassStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;

  @ApiPropertyOptional({ description: 'Filter by grade (e.g. "10")' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({ description: 'Filter by academic year (e.g. "2024-2025")' })
  @IsOptional()
  @IsString()
  academicYear?: string;
}
