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

  /**
   * Retrieves bee data, either from cache or by fetching from the bees service.
   *
   * @returns An observable containing the bee data. If data is available in cache
   *          (indicated by `this.beesSignal()`), returns the cached data as an observable.
   *          Otherwise, it fetches data from `beesService.getBees()` and caches it.
   */
  getData() {
    if (this.beesSignal()) {
      return of(this.beesSignal());
    }

    return this.beesService.getBees().pipe(
      tap((bees) => {
        this._beesSignal.set(bees);
        this.localStorageService.setBees(bees);
      })
    );
  }

  /**
   * Sets the player's name and stores it in local storage.
   *
   * @param value - The player's name to be set.
   */
  setPlayerName(value: string) {
    this._playerNameSignal.set(value);
    this.localStorageService.setPlayerName(value);
  }

  /**
   * Hits a random bee from the list and updates the bee data accordingly.
   */
  hitRandomBee() {
    const bees = this.beesSignal();

    if (!bees?.length) return;

    const targetBee = this.utils.getRandomItem(bees);
    this._targetBeeSignal.set(targetBee);
    this.localStorageService.setTargetBee(targetBee);

    const updatedBees = this.hitBee(targetBee);
    this._beesSignal.set(updatedBees);
    this.localStorageService.setBees(updatedBees);
  }

  /**
   * Resets the game board by clearing the target bee and bee signals,
   * and then reinitializing the data.
   *
   * @returns The observable returned by `getData()` after resetting the board.
   */
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
