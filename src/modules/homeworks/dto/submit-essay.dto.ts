import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SubmitEssayDto {
  @ApiProperty({ example: 'uuid-student' })
  @IsUUID()
  studentId: string;
}
