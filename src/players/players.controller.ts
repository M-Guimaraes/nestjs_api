import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/interface.player';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) { }

  @Post()
  async createAndUpdatePlayer(
    @Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playerService.createAndUpdatePlayer(createPlayerDTO);
  }

  @Get()
  async consultAllPlayers(
    @Query('email') email: string): Promise<Player | Player[]> {
    if (email) {
      return await this.playerService.consultPlayerByEmail(email);
    } else {
      return await this.playerService.consultAllPlayers();
    }
  }

  @Delete()
  async deletePlayer(
    @Query('email') email: string): Promise<void> {
    this.playerService.deletePlayer(email)
  }
}
