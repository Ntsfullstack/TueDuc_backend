import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Toán học' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'MATH10' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Môn Toán lớp 10', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'uuid-class' })
  @IsUUID()
  classId: string;

  @ApiProperty({ example: 'uuid-teacher', required: false })
  @IsOptional()
  @IsUUID()
  teacherId?: string;
}
