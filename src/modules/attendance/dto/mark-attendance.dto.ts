import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../entities/attendance-record.entity';

export class AttendanceRecordInputDto {
  @ApiProperty({ example: 'uuid-student' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

export class MarkAttendanceDto {
  @ApiProperty({ example: 'uuid-class' })
  @IsUUID()
  classId: string;

  @ApiProperty({ example: '2026-03-24' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'uuid-shift' })
  @IsUUID()
  shiftId: string;

  @ApiProperty({ type: [AttendanceRecordInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordInputDto)
  records: AttendanceRecordInputDto[];
}
