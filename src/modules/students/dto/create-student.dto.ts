import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Nguyễn Văn B' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2012-05-20', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'male', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 'uuid-parent', required: false })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({ example: 'uuid-class', required: false })
  @IsOptional()
  @IsUUID()
  classId?: string;
}
