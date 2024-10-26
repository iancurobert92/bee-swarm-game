import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { AppComponent } from './app.component';
import { HiveComponent } from './components/hive/hive.component';
import { GameBoardService } from './services/game-board.service';
import { signal } from '@angular/core';

describe('AppComponent', () => {
  let fixture: MockedComponentFixture;
  const gameBoardServiceMock = {
    beesSignal: signal([]),
    targetBeeSignal: signal(undefined),
    playerNameSignal: signal(''),
  };
  beforeEach(async () => {
    await MockBuilder(AppComponent).mock(HiveComponent).mock(GameBoardService, gameBoardServiceMock);

    fixture = MockRender(AppComponent);
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
