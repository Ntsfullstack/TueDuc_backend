import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class GradeSubmissionDto {
  @ApiProperty({ example: 8.5 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score: number;
}
