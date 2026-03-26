import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class ClaimStudentDto {
  @ApiProperty({
    example: 'HS-A1B2C3',
    description: 'Mã học sinh được cấp bởi admin (format: HS-XXXXXX)',
  })
  @IsString()
  @Matches(/^HS-[A-Z0-9]{6}$/, {
    message: 'Mã học sinh không hợp lệ. Định dạng đúng: HS-XXXXXX (6 ký tự in hoa hoặc số)',
  })
  studentCode: string;
}
