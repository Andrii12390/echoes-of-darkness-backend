import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { MatchService } from './match.service';
import { FinishMatchDto } from './dto/finish-match.dto';
import { Authorization } from 'src/common/decorators/auth.decorator';
import { Authorized } from 'src/common/decorators/authorized.decorator';
import { User } from '@prisma/client';

@ApiTags('match')
@Authorization()
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: '(непотрібно тіло)',
    required: false
  })
  @ApiResponse({
    status: 200,
    description: 'Start a new match by returning a random bot deck'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async startMatch() {
    return await this.matchService.getBotDeck();
  }

  @Post('finish')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: 'Result of the match',
    type: FinishMatchDto
  })
  @ApiResponse({
    status: 200,
    description: 'Finish match: updates user exp/level and returns new stats'
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async finishMatch(@Body() data: FinishMatchDto, @Authorized() user: User) {
    return this.matchService.finishMatch(user.id, data.result);
  }
}
