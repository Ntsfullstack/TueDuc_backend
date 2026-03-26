import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class CreateClassScheduleDto {
  @ApiProperty({ example: 'uuid-class' })
  @IsUUID()
  classId: string;

  @ApiProperty({ example: 1, description: '0=Sunday..6=Saturday' })
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number;

  @ApiProperty({ example: 'uuid-shift' })
  @IsUUID()
  shiftId: string;

  @ApiProperty({ example: 'uuid-teacher' })
  @IsUUID()
  teacherId: string;
}
