import {
  IsEnum,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { MatchResult } from '@prisma/client';

export class FinishMatchDto {
  @ApiProperty()
  @IsString()
  @IsEnum(MatchResult)
  result: string;
}