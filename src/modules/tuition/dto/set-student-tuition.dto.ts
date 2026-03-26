import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SetStudentTuitionDto {
  @ApiProperty({ example: 2000000 })
  @IsInt()
  @Min(0)
  monthlyFee: number;
}
