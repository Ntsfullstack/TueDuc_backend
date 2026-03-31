import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { StudentStatus } from '../entities/student.entity';

export class ListStudentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by class ID' })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiPropertyOptional({ enum: StudentStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  @ApiPropertyOptional({ description: 'Filter by gender (male/female/other)' })
  @IsOptional()
  @IsString()
  gender?: string;
}
