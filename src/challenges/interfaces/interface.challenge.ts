import { Document } from 'mongoose'
import { Player } from '../../players/interfaces/interface.player'
import { StatusChallenge } from './status-challenge.unum'

export interface Challenge extends Document {
  dateOfChallenge: Date;
  status: StatusChallenge;
  dateHourRequest: Date;
  dateHourResponse: Date;
  requester: Player;
  category: string;
  players: Array<Player>;
  matches: String
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>
}

export interface Result {
  set: string;
}
