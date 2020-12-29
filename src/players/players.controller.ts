import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/interface.player';
import { ValidationParamsPipe } from '../common/pipes/validation-params.pipe'

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return await this.playerService.createPlayer(createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async UpdatePlayer(@Body() updatePlayerDTO: UpdatePlayerDTO, @Param('_id', ValidationParamsPipe) _id: string): Promise<void> {
    await this.playerService.updatePlayer(_id, updatePlayerDTO);
  }

  @Get()
  async consultAllPlayers(): Promise<Player[]> {
    return await this.playerService.consultAllPlayers();
  }

  @Get('/:_id')
  async consultAllPlayerById(
    @Param('_id', ValidationParamsPipe) _id: string): Promise<Player> {
    return await this.playerService.consultPlayerById(_id);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidationParamsPipe) _id: string): Promise<void> {
    this.playerService.deletePlayer(_id)
  }
}
