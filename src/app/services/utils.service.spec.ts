import { TestBed } from '@angular/core/testing';

import { BeeType } from '../enums/bee-type';
import { Utils } from './utils.service';

describe('UtilsService', () => {
  let service: Utils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Utils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should group items by key', () => {
    const items = [
      { type: BeeType.Queen, health: 100, damage: 8 },
      { type: BeeType.Worker, health: 75, damage: 10 },
      { type: BeeType.Worker, health: 75, damage: 10 },
      { type: BeeType.Drone, health: 50, damage: 12 },
    ];
    const expectedResult = {
      Queen: [{ type: BeeType.Queen, health: 100, damage: 8 }],
      Worker: [
        { type: BeeType.Worker, health: 75, damage: 10 },
        { type: BeeType.Worker, health: 75, damage: 10 },
      ],
      Drone: [{ type: BeeType.Drone, health: 50, damage: 12 }],
    };
    const result = service.groupItemsBy(items, 'type');

    expect(result).toEqual(expectedResult);
  });
});
