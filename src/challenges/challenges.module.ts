import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { ChallengesController } from './challenges.controller'
import { ChallengeService } from './challenges.service';
import { ChallengeSchema } from './interfaces/challenge.schemas';
import { MatchSchema } from './interfaces/match.schemas'
import { PlayersModule } from '../players/players.module'
import { CategoriesModule } from '../categories/categories.module'

@Module({
  imports: [
    PlayersModule,
    CategoriesModule,
    MongooseModule.forFeature([
      { name: 'Challenge', schema: ChallengeSchema },
      { name: 'Match', schema: MatchSchema }
    ]),
  ],
  controllers: [ChallengesController],
  providers: [ChallengeService],
})
export class ChallengesModule { }
