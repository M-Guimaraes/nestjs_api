import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
import { Player } from './interfaces/interface.player';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>
  ) { }

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {

    const { email } = createPlayerDTO;

    const existPlayer = await this.playerModel.findOne({ email }).lean().exec();

    if (existPlayer) throw new BadRequestException(`The player already exist.`)

    const createdPlayer = new this.playerModel(createPlayerDTO)

    return await createdPlayer.save()

  }

  async updatePlayer(_id: string, updatePlayerDTO: UpdatePlayerDTO): Promise<void> {

    const existPlayer = await this.playerModel.findOne({ _id }).lean().exec();

    if (!existPlayer) throw new NotFoundException(`Player with id ${_id} not found.`)

    await this.playerModel.findByIdAndUpdate({ _id }, { $set: updatePlayerDTO }).exec()

  }

  async consultAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async consultPlayerById(_id: string): Promise<Player> {

    const foundedPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!foundedPlayer) throw new NotFoundException(`Player with id: ${_id} not found`)

    return foundedPlayer
  }

  async deletePlayer(_id: string): Promise<void> {

    const foundedPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!foundedPlayer) throw new NotFoundException(`Player with id: ${_id} not found`)

    return await this.playerModel.deleteOne({ _id }).exec()
  }
}
