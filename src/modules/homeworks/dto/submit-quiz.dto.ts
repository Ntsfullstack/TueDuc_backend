import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class SubmitQuizDto {
  @ApiProperty({ example: 'uuid-student' })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    example: [1, 0, 3],
    description: '0-based chosen option index per question',
  })
  @IsArray()
  answers: number[];
}
