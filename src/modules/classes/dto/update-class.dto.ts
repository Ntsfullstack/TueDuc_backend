import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ClassStatus } from '../entities/class.entity';

export class UpdateClassDto {
  @ApiPropertyOptional({ example: 'Lớp 10A1' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({ example: '2026-2027' })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({ example: 'uuid-teacher' })
  @IsOptional()
  @IsUUID()
  homeroomTeacherId?: string;

  @ApiPropertyOptional({ enum: ClassStatus, example: ClassStatus.OPEN })
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxStudents?: number;
}
