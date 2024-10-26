import { inject, Injectable, Signal, signal } from '@angular/core';
import { of, tap } from 'rxjs';
import { BeeType } from '../enums/bee-type';
import { Bee } from '../models/bee.model';
import { BeesService } from './bees.service';
import { LocalStorageService } from './local-storage.service';
import { Utils } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class GameBoardService {
  private beesService = inject(BeesService);
  private localStorageService = inject(LocalStorageService);
  private utils = inject(Utils);

  private _beesSignal = signal<Bee[] | undefined>(undefined);
  get beesSignal(): Signal<Bee[] | undefined> {
    return this._beesSignal;
  }

  private _targetBeeSignal = signal<Bee | undefined>(undefined);
  get targetBeeSignal(): Signal<Bee | undefined> {
    return this._targetBeeSignal;
  }

  private _playerNameSignal = signal<string>('');
  get playerNameSignal(): Signal<string> {
    return this._playerNameSignal;
  }

  constructor() {
    this._beesSignal.set(this.localStorageService.getBees());
    this._targetBeeSignal.set(this.localStorageService.getTargetBee());
    this._playerNameSignal.set(this.localStorageService.getPlayerName());
  }

  getData() {
    if (this._beesSignal()) {
      return of(this._beesSignal());
    }

    return this.beesService.getBees().pipe(
      tap((bees) => {
        this._beesSignal.set(bees);
        this.localStorageService.setBees(bees);
      })
    );
  }

  setPlayerName(value: string) {
    this._playerNameSignal.set(value);
    this.localStorageService.setPlayerName(value);
  }

  hitRandomBee() {
    const bees = this._beesSignal();
    if (!bees) return;

    const targetBee = this.utils.getRandomItem(bees);
    this._targetBeeSignal.set(targetBee);
    this.localStorageService.setTargetBee(targetBee);

    const updatedBees = this.hitBee(targetBee);
    this._beesSignal.set(updatedBees);
    this.localStorageService.setBees(updatedBees);
  }

  resetBoard() {
    this._targetBeeSignal.set(undefined);
    this._beesSignal.set(undefined);
    return this.getData();
  }

  private hitBee(bee: Bee): Bee[] {
    bee.health -= bee.damage;
    const bees = this._beesSignal() ?? [];
    if (bee.health <= 0) {
      const index = bees.findIndex((item) => item === bee);
      bees.splice(index, 1);
    }

    const queenBee = bees.find((bee) => bee.type === BeeType.Queen);

    if (!queenBee) {
      return this.killAllBees();
    }

    return [...bees];
  }

  private killAllBees() {
    this._beesSignal.set([]);
    this._targetBeeSignal.set(undefined);
    this.localStorageService.setTargetBee(undefined);

    return [];
  }
}
