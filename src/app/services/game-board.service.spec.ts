import { TestBed } from '@angular/core/testing';

import { MockBuilder } from 'ng-mocks';
import { BeesService } from './bees.service';
import { GameBoardService } from './game-board.service';

describe('GameBoardService', () => {
  let service: GameBoardService;

  beforeEach(async () => {
    await MockBuilder(GameBoardService).mock(BeesService);
    service = TestBed.inject(GameBoardService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
