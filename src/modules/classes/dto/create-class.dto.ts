import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ example: 'Lớp 10A1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '10' })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({ example: '2026-2027' })
  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxStudents?: number;
}
