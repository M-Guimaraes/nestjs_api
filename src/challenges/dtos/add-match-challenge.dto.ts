import { Player } from '../../players/interfaces/interface.player';
import { Result } from '../../challenges/interfaces/interface.challenge';
import { IsNotEmpty } from 'class-validator';

export class AddChallengeMatchDTO {

  @IsNotEmpty()
  def: Player

  @IsNotEmpty()
  result: Array<Result>

}