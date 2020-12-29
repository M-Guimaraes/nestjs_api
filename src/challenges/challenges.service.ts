import { Injectable, BadRequestException, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, Match } from './interfaces/interface.challenge';
import { StatusChallenge } from './interfaces/status-challenge.unum';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { AddChallengeMatchDTO } from './dtos/add-match-challenge.dto';
import { PlayersService } from '../players/players.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playerService: PlayersService,
    private readonly categoriesServise: CategoriesService) { }

  private readonly logger = new Logger(ChallengeService.name)

  async createChallenge(createChallengeDTO: CreateChallengeDTO): Promise<Challenge> {
    const { requester } = createChallengeDTO;

    const players = await this.playerService.consultAllPlayers();

    createChallengeDTO.players.map(playerDTO => {
      const playerFilter = players.filter(player => player._id == playerDTO._id);
      if (playerFilter.length == 0) throw new BadRequestException(`The id ${playerDTO._id} is not a player!`)
    })

    const requesterIsPlayerMatch = await createChallengeDTO.players.filter(player => player._id == requester)

    this.logger.log(`sequesterIsPlayerMatch: ${requesterIsPlayerMatch}`)

    if (requesterIsPlayerMatch.length == 0) throw new BadRequestException(`The requester must be a player of match!`)

    const categoryOfPlayer = await this.categoriesServise.consultCategoryOfPlayer(requester)

    if (!categoryOfPlayer) throw new BadRequestException(`The requester must be registered in a category!`)

    const createdChallenge = await new this.challengeModel(createChallengeDTO)

    createdChallenge.category = categoryOfPlayer.category
    createdChallenge.dateHourRequest = new Date()
    this.logger.log(`createdChallenge.dateHourRequest: ${createdChallenge.dateHourRequest}`)

    createdChallenge.status = StatusChallenge.PENDING
    this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`)

    return await createdChallenge.save()
  }

  async consultAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel.find()
      .populate("requester")
      .populate("players")
      .populate("matches")
      .exec()
  }

  async consultChallengesOfPlayer(_id: any): Promise<Array<Challenge>> {
    const players = await this.playerService.consultAllPlayers()

    const playersFilter = players.filter(player => player._id == _id)

    if (playersFilter.length == 0) throw new BadRequestException(`The id ${_id} is not a player!`)

    return await this.challengeModel.find()
      .where('players')
      .in(_id)
      .populate("requester")
      .populate("players")
      .populate("match")
      .exec()
  }

  async updateChallenge(_id: string, updateChallengeDTO: UpdateChallengeDTO): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec()

    if (!foundChallenge) throw new NotFoundException(`Challenge ${_id} not registered!`)

    if (updateChallengeDTO.status) foundChallenge.dateHourResponse = new Date()

    foundChallenge.status = updateChallengeDTO.status
    foundChallenge.dateOfChallenge = updateChallengeDTO.dateHourChallenge

    await this.challengeModel.findOneAndUpdate({ _id }, { $set: foundChallenge }).exec()

  }

  async addChallengeMatch(_id: string, addChallengeMatchDTO: AddChallengeMatchDTO): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec()

    if (!foundChallenge) throw new BadRequestException(`Challenge ${_id} not registered!`)

    const playerFilter = foundChallenge.players.filter(player => player._id == addChallengeMatchDTO.def)

    this.logger.log(`foundChallenge: ${foundChallenge}`)
    this.logger.log(`playerFilter: ${playerFilter}`)

    if (playerFilter.length == 0) throw new BadRequestException(`The winner player is not part of the challenge`)

    const createdMatch = new this.matchModel(addChallengeMatchDTO)

    createdMatch.category = foundChallenge.category
    createdMatch.players = foundChallenge.players

    const result = await createdMatch.save()

    foundChallenge.status = StatusChallenge.REALIZED

    foundChallenge.matches = result._id

    try {
      await this.challengeModel.findOneAndUpdate({ _id }, { $set: foundChallenge }).exec()
    } catch (err) {
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException()
    }


  }

  async deleteChallenge(_id: string): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec()

    if (!foundChallenge) throw new BadRequestException(`Challenge ${_id} not found!`)

    foundChallenge.status = StatusChallenge.CANCELED

    await this.challengeModel.findOneAndUpdate({ _id }, { $set: foundChallenge }).exec()
  }
}
