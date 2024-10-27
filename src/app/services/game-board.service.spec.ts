import { TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';
import { MockBuilder, MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { BeeType } from '../enums/bee-type';
import { BeesService } from './bees.service';
import { GameBoardService } from './game-board.service';
import { LocalStorageService } from './local-storage.service';
import { Utils } from './utils.service';

describe('GameBoardService', () => {
  const bees = [
    { type: BeeType.Queen, health: 100, damage: 8 },
    { type: BeeType.Worker, health: 75, damage: 10 },
    { type: BeeType.Worker, health: 75, damage: 10 },
    { type: BeeType.Drone, health: 50, damage: 12 },
  ];
  let service: GameBoardService;
  const beesServiceMock = MockService(BeesService, {
    getBees: () => of(bees),
  });

  const localStorageServiceMock = MockService(LocalStorageService, {
    setBees: () => {},
    setPlayerName: () => {},
  });

  beforeEach(async () => {
    spyOn(beesServiceMock, 'getBees').and.callThrough();
    spyOn(localStorageServiceMock, 'setBees').and.callThrough();
    spyOn(localStorageServiceMock, 'setPlayerName').and.callThrough();

    await MockBuilder(GameBoardService)
      .mock(LocalStorageService, localStorageServiceMock)
      .mock(BeesService, beesServiceMock)
      .mock(Utils);

    service = TestBed.inject(GameBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getData', () => {
    it('should return bees from cache', (done) => {
      spyOnProperty(service, 'beesSignal', 'get').and.returnValue(signal(bees));

      service.getData().subscribe((result) => {
        expect(beesServiceMock.getBees).not.toHaveBeenCalled();
        expect(result).toEqual(bees);
        done();
      });
    });

    it('should return bees from service', (done) => {
      service.getData().subscribe((result) => {
        expect(beesServiceMock.getBees).toHaveBeenCalled();
        expect(result).toEqual(bees);
        done();
      });
    });

    it('should should save bees to local storage', (done) => {
      service.getData().subscribe(() => {
        expect(localStorageServiceMock.setBees).toHaveBeenCalled();
        done();
      });
    });

    it('should should set beesSignal value', (done) => {
      service.getData().subscribe((result) => {
        expect(service.beesSignal()).toBe(result);
        done();
      });
    });
  });

  describe('setPlayerName', () => {
    it('should set player name', () => {
      const playerName = 'Player name';
      service.setPlayerName(playerName);

      expect(service.playerNameSignal()).toBe(playerName);
    });

    it('should should set player name to local storage', () => {
      const playerName = 'Player name';
      service.setPlayerName(playerName);

      expect(localStorageServiceMock.setPlayerName).toHaveBeenCalledWith(playerName);
    });
  });
});
