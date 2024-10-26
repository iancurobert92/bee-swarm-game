import { Injectable } from '@angular/core';
import { Bee } from '../models/bee.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getBees(): Bee[] | undefined {
    const beesString = window.localStorage.getItem('bees');
    if (!beesString) return undefined;
    return JSON.parse(beesString);
  }

  setBees(value: Bee[] | undefined) {
    if (!value) {
      window.localStorage.removeItem('bees');
      return;
    }
    window.localStorage.setItem('bees', JSON.stringify(value));
  }

  getTargetBee(): Bee | undefined {
    const targetBeeString = window.localStorage.getItem('targetBee');
    if (!targetBeeString) return undefined;
    return JSON.parse(targetBeeString);
  }

  setTargetBee(value: Bee | undefined) {
    if (!value) {
      window.localStorage.removeItem('targetBee');
      return;
    }
    window.localStorage.setItem('targetBee', JSON.stringify(value));
  }

  getPlayerName(): string {
    return JSON.parse(window.localStorage.getItem('playerName') ?? '""');
  }

  setPlayerName(value: string) {
    window.localStorage.setItem('playerName', JSON.stringify(value));
  }
}
