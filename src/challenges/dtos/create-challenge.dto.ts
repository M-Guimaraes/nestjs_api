import { IsDateString, IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Player } from '../../players/interfaces/interface.player';

export class CreateChallengeDTO {

  @IsNotEmpty()
  @IsDateString()
  dateHourChallenge: Date;

  @IsNotEmpty()
  requester: Player;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Array<Player>;
}

