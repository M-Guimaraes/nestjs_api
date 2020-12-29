import { StatusChallenge } from '../interfaces/status-challenge.unum';
import { IsOptional } from 'class-validator';

export class UpdateChallengeDTO {


  @IsOptional()
  dateHourChallenge: Date;

  @IsOptional()
  status: StatusChallenge;
}