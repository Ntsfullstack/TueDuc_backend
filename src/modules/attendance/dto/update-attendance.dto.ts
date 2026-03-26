import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus } from '../entities/attendance-record.entity';

export class AttendanceRecordPatchDto {
  @ApiProperty({ example: 'uuid-student' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateAttendanceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ type: [AttendanceRecordPatchDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordPatchDto)
  records: AttendanceRecordPatchDto[];
}
