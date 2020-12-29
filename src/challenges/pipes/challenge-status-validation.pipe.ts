import { PipeTransform, BadRequestException } from '@nestjs/common';
import { StatusChallenge } from '../interfaces/status-challenge.unum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly statusAllowed = [
    StatusChallenge.ACCEPT,
    StatusChallenge.DENIED,
    StatusChallenge.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidState(status)) throw new BadRequestException(`${status} is an invalid status!`)

    return value
  }

  private isValidState(status: any) {
    const idx = this.statusAllowed.indexOf(status);

    return idx !== -1;
  }
}

