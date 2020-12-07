import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/interface.player';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  async createAndUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playerService.createAndUpdatePlayer(createPlayerDTO);
  }

  @Get()
  async consultAllPlayers(): Promise<Player[]> {
    return this.playerService.consultAllPlayers();
  }
}
