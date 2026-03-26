import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateTuitionPaymentDto {
  @ApiProperty({ example: '2026-03' })
  @IsString()
  @Matches(/^\d{4}-\d{2}$/)
  month: string;

  @ApiProperty({ example: 1000000 })
  @IsInt()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 'cash' })
  @IsOptional()
  @IsString()
  method?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
