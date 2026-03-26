import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class SetTeacherRateDto {
  @ApiProperty({ example: 'uuid-shift' })
  @IsUUID()
  shiftId: string;

  @ApiProperty({ example: 150000 })
  @IsInt()
  @Min(0)
  amountPerSession: number;
}
