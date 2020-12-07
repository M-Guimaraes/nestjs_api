import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/interface.player';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private player: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async createAndUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const existPlayer = await this.player.find((player) => {
      return player.email === email;
    });

    if (existPlayer) {
      await this.update(existPlayer, createPlayerDTO);
    } else {
      this.create(createPlayerDTO);
    }
  }

  async consultAllPlayers(): Promise<Player[]> {
    return await this.player;
  }
  private create(createPlayerDTO: CreatePlayerDTO): void {
    const { phoneNumber, email, name } = createPlayerDTO;
    const player: Player = {
      _id: uuidv4(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      rankingPosition: '1',
      photoPlayerUrl: 'www.endereço',
    };

    this.logger.log(`createPlayerDTO: ${JSON.stringify(player)}`);

    this.player.push(player);
  }

  private update(findedPlayer: Player, createPlayerDTO: CreatePlayerDTO): void {
    const { name } = createPlayerDTO;
    findedPlayer.name = name;
  }
}
