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

  private _beesSignal = signal<Bee[]>([]);
  get beesSignal(): Signal<Bee[]> {
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
    if (this._beesSignal().length) {
      return of(this._beesSignal());
    }

    return this.beesService.getBees().pipe(tap(this._beesSignal.set));
  }

  setPlayerName(value: string) {
    this._playerNameSignal.set(value);
    this.localStorageService.setPlayerName(value);
  }

  hitRandomBee() {
    const targetBee = this.utils.getRamdomItem(this._beesSignal());
    this._targetBeeSignal.set(targetBee);
    this.localStorageService.setTargetBee(targetBee);

    const updatedBees = this.hitBee(targetBee);
    this._beesSignal.set(updatedBees);
    this.localStorageService.setBees(updatedBees);
  }

  resetBoard() {
    this._targetBeeSignal.set(undefined);
    return this.getData();
  }

  private hitBee(bee: Bee): Bee[] {
    bee.health -= bee.damage;
    if (bee.health <= 0) {
      const index = this._beesSignal().findIndex((item) => item === bee);
      this._beesSignal().splice(index, 1);
    }

    const queenBee = this._beesSignal().find((bee) => bee.type === BeeType.Queen);
    if (!queenBee) {
      this.killAllBees();
    }

    return [...this._beesSignal()];
  }

  private killAllBees() {
    this._beesSignal.set([]);
    this._targetBeeSignal.set(undefined);
  }
}
