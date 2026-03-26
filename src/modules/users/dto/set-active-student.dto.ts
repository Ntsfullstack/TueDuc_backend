import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SetActiveStudentDto {
  @ApiProperty({ example: 'uuid-student' })
  @IsUUID()
  studentId: string;
}
