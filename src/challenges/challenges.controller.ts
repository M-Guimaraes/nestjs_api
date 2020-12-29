import { Controller, Delete, Get, Post, Put, UsePipes, ValidationPipe, Logger, Body, Query, Param } from '@nestjs/common';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { AddChallengeMatchDTO } from './dtos/add-match-challenge.dto';
import { ChallengeService } from './challenges.service';
import { Challenge } from './interfaces/interface.challenge';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe'

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengeServise: ChallengeService) { }

  private readonly logger = new Logger(ChallengesController.name)

  @Post()
  @UsePipes(ValidationPipe)
  async createChalenge(@Body() createChallengeDTO: CreateChallengeDTO): Promise<Challenge> {
    this.logger.log(`createChallengeDTO: ${JSON.stringify(createChallengeDTO)}`)
    return await this.challengeServise.createChallenge(createChallengeDTO)
  }

  @Get()
  async consultChallenges(@Query('idPlayer') _id: string): Promise<Array<Challenge>> {
    return _id ? await this.challengeServise.consultChallengesOfPlayer(_id) : await this.challengeServise.consultAllChallenges()
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDTO: UpdateChallengeDTO, @Param('challenge') _id: string): Promise<void> {
    await this.challengeServise.updateChallenge(_id, updateChallengeDTO)
  }

  @Post('/:challenge/match/')
  async addChallengeMatch(@Body(ValidationPipe) addChallengeMatchDTO: AddChallengeMatchDTO, @Param('challenge') _id: string): Promise<void> {
    return await this.challengeServise.addChallengeMatch(_id, addChallengeMatchDTO)
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengeServise.deleteChallenge(_id)
  }

}
