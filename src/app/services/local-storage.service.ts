import { Injectable } from '@angular/core';
import { Bee } from '../models/bee.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getBees(): Bee[] {
    return JSON.parse(window.localStorage.getItem('bees') ?? '{}');
  }

  setBees(value: Bee[]) {
    window.localStorage.setItem('bees', JSON.stringify(value));
  }

  getTargetBee(): Bee {
    return JSON.parse(window.localStorage.getItem('targetBee') ?? '""');
  }

  setTargetBee(value: Bee) {
    window.localStorage.setItem('targetBee', JSON.stringify(value));
  }
}
