import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/interface.player';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>
  ) { }

  private readonly logger = new Logger(PlayersService.name);

  async createAndUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const existPlayer = await this.playerModel.findOne({ email }).lean().exec();

    if (existPlayer) {
      await this.update(createPlayerDTO);
    } else {
      await this.create(createPlayerDTO);
    }
  }

  async consultAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async consultPlayerByEmail(email: string): Promise<Player> {
    const foundedPlayer = await this.playerModel.findOne({ email }).exec();
    if (!foundedPlayer) {
      throw new NotFoundException(`Player with e-mail: ${email} not found`);
    }
    return foundedPlayer
  }

  async deletePlayer(email: string): Promise<void> {
    return await this.playerModel.remove({ email }).exec()
  }

  private async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDTO)
    return await createdPlayer.save()
  }

  private async update(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return await this.playerModel.findByIdAndUpdate({ email: createPlayerDTO.email }, { $set: createPlayerDTO }).exec()
  }
}
