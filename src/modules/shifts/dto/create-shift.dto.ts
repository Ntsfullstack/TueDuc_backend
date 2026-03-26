import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ example: 'Ca 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '08:00:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  startTime: string;

  @ApiProperty({ example: '10:00:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  endTime: string;
}
