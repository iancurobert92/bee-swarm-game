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
  const beesServiceMock = MockService(BeesService);

  const localStorageServiceMock = MockService(LocalStorageService);

  const utilsMock = MockService(Utils);

  beforeEach(async () => {
    spyOn(beesServiceMock, 'getBees').and.returnValue(of(bees));
    spyOn(localStorageServiceMock, 'setBees').and.callThrough();
    spyOn(localStorageServiceMock, 'setTargetBee').and.callThrough();
    spyOn(localStorageServiceMock, 'setPlayerName').and.callThrough();
    spyOn(utilsMock, 'getRandomItem').and.returnValue(bees[0]);

    await MockBuilder(GameBoardService)
      .mock(LocalStorageService, localStorageServiceMock)
      .mock(BeesService, beesServiceMock)
      .mock(Utils, utilsMock);

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

    it('should save bees to local storage', (done) => {
      service.getData().subscribe(() => {
        expect(localStorageServiceMock.setBees).toHaveBeenCalled();
        done();
      });
    });

    it('should set beesSignal value', (done) => {
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

  describe('hitRandomBee', () => {
    it('should stop execution if the bees list is empty or undefined', () => {
      spyOnProperty(service, 'beesSignal', 'get').and.returnValue(signal([]));

      service.hitRandomBee();

      expect(utilsMock.getRandomItem).not.toHaveBeenCalled();
    });

    it('should set target bee', () => {
      spyOnProperty(service, 'beesSignal', 'get').and.returnValue(signal(bees));

      service.hitRandomBee();

      expect(utilsMock.getRandomItem).toHaveBeenCalledWith(bees);
    });

    it('should save target bee to local storage', () => {
      spyOnProperty(service, 'beesSignal', 'get').and.returnValue(signal(bees));

      service.hitRandomBee();

      expect(localStorageServiceMock.setTargetBee).toHaveBeenCalledWith(bees[0]);
    });

    it('should hit the target bee', () => {
      spyOnProperty(service, 'beesSignal', 'get').and.returnValue(signal(bees));
      spyOnProperty(service, 'targetBeeSignal', 'get').and.returnValue(signal(bees[0]));

      const initialHealth = bees[0].health;

      service.hitRandomBee();

      const finalHealth = service.targetBeeSignal()?.health;

      expect(finalHealth).toBeLessThan(initialHealth);
    });

    it('should save the updated bees in local storage', () => {
      spyOnProperty(service, 'beesSignal', 'get').and.returnValue(signal(bees));

      service.hitRandomBee();

      expect(localStorageServiceMock.setBees).toHaveBeenCalled();
    });
  });

  describe('resetBoard', () => {
    it('should reinitialize data', (done) => {
      spyOn(service, 'getData').and.returnValue(of(bees));

      service.resetBoard().subscribe((result) => {
        expect(service.beesSignal()).toBe(undefined);
        expect(service.targetBeeSignal()).toBe(undefined);
        expect(result).toEqual(bees);
        done();
      });
    });
  });
});
