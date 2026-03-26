import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { HomeworkTargetScope, HomeworkType } from '../entities/homework.entity';

export class QuizQuestionDto {
  @ApiProperty({ example: 'Câu hỏi 1' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ example: ['A', 'B', 'C', 'D'] })
  @IsArray()
  options: string[];

  @ApiProperty({ example: 1, description: '0-based index of correct option' })
  correctIndex: number;
}

export class CreateHomeworkDto {
  @ApiProperty({ example: 'Bài tập tuần 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: HomeworkType, example: HomeworkType.QUIZ })
  @IsEnum(HomeworkType)
  type: HomeworkType;

  @ApiProperty({ required: false, example: '2026-03-30T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @ApiProperty({ example: 'uuid-class' })
  @IsUUID()
  classId: string;

  @ApiProperty({
    enum: HomeworkTargetScope,
    example: HomeworkTargetScope.CLASS,
  })
  @IsEnum(HomeworkTargetScope)
  targetScope: HomeworkTargetScope;

  @ApiProperty({
    required: false,
    example: ['uuid-student-1', 'uuid-student-2'],
  })
  @IsOptional()
  @IsArray()
  studentIds?: string[];

  @ApiProperty({ required: false, type: [QuizQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  quizQuestions?: QuizQuestionDto[];

  @ApiProperty({
    required: false,
    example: 'uuid-teacher',
    description: 'Admin only',
  })
  @IsOptional()
  @IsUUID()
  teacherId?: string;
}
