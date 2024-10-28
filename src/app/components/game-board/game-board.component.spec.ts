import { signal } from '@angular/core';
import { MockBuilder, MockedComponentFixture, MockRender, MockService, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { BeeType } from '../../enums/bee-type';
import { GameBoardService } from '../../services/game-board.service';
import { HiveComponent } from '../hive/hive.component';
import { GameBoardComponent } from './game-board.component';

describe('GameBoardComponent', () => {
  const bees = [
    { type: BeeType.Queen, health: 100, damage: 8 },
    { type: BeeType.Worker, health: 75, damage: 10 },
    { type: BeeType.Worker, health: 75, damage: 10 },
    { type: BeeType.Drone, health: 50, damage: 12 },
  ];

  let fixture: MockedComponentFixture;
  const gameBoardServiceMock = MockService(GameBoardService);

  beforeEach(async () => {
    spyOn(gameBoardServiceMock, 'getData').and.returnValue(of(bees));
    spyOn(gameBoardServiceMock, 'hitRandomBee').and.callThrough();
    spyOn(gameBoardServiceMock, 'resetBoard').and.returnValue(of(bees));
    spyOnProperty(gameBoardServiceMock, 'playerNameSignal', 'get').and.returnValue(signal(''));
    spyOnProperty(gameBoardServiceMock, 'beesSignal', 'get').and.returnValue(signal([]));
    spyOnProperty(gameBoardServiceMock, 'targetBeeSignal', 'get').and.returnValue(signal(undefined));
    await MockBuilder(GameBoardComponent).mock(HiveComponent).mock(GameBoardService, gameBoardServiceMock);
    fixture = MockRender(GameBoardComponent);
  });

  it('should create the app', () => {
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should render player name', () => {
    const playerName = 'Player 1';
    fixture.point.componentInstance.playerNameSignal.set(playerName);
    fixture.detectChanges();
    const playerNameDebugElement = ngMocks.find(fixture, "[data-testid='player-details']");
    expect(ngMocks.formatText(playerNameDebugElement)).toBe(`Player name: ${playerName}`);
  });

  it('should hit a random bee', () => {
    fixture.point.componentInstance.beesSignal.set(bees);
    fixture.detectChanges();
    const hitButtonDebugElement = ngMocks.find(fixture, "[data-testid='hit-button']");
    ngMocks.click(hitButtonDebugElement);

    expect(gameBoardServiceMock.hitRandomBee).toHaveBeenCalled();
  });

  it('should reset the board', () => {
    fixture.point.componentInstance.beesSignal.set([]);
    fixture.detectChanges();
    const restartButtonDebugElement = ngMocks.find(fixture, "[data-testid='restart-button']");
    ngMocks.click(restartButtonDebugElement);

    expect(gameBoardServiceMock.resetBoard).toHaveBeenCalled();
  });

  it('should render the TYPE of the hit bee', () => {
    const targetBee = { type: BeeType.Queen, health: 100, damage: 8 };
    fixture.point.componentInstance.targetBeeSignal.set(targetBee);
    fixture.detectChanges();
    const hitBeeTypeDebugElement = ngMocks.find(fixture, "[data-testid='target-bee-type']");
    expect(ngMocks.formatText(hitBeeTypeDebugElement)).toBe(`Target Bee Type: ${targetBee.type}`);
  });

  it('should render the DAMAGE of the hit bee', () => {
    const targetBee = { type: BeeType.Queen, health: 100, damage: 8 };
    fixture.point.componentInstance.targetBeeSignal.set(targetBee);
    fixture.detectChanges();
    const hitBeeDamageDebugElement = ngMocks.find(fixture, "[data-testid='target-bee-damage']");
    expect(ngMocks.formatText(hitBeeDamageDebugElement)).toBe(`Damage: ${targetBee.damage}`);
  });

  it('should render the "Restart" button', () => {
    fixture.point.componentInstance.beesSignal.set([]);
    fixture.detectChanges();
    const restartButtonDebugElement = ngMocks.find(fixture, "[data-testid='restart-button']");
    expect(restartButtonDebugElement).toBeTruthy();
  });

  it('should render the "Hit" button', () => {
    fixture.point.componentInstance.beesSignal.set([]);
    fixture.detectChanges();
    const restartButtonDebugElement = ngMocks.find(fixture, "[data-testid='hit-button']");
    expect(restartButtonDebugElement).toBeTruthy();
  });

  it('should render the Hive', () => {
    fixture.point.componentInstance.beesSignal.set(bees);
    fixture.detectChanges();
    const hiveComponent = ngMocks.findInstance(HiveComponent);
    expect(hiveComponent).toBeTruthy();
  });

  it('should render the "Game Over" message', () => {
    fixture.point.componentInstance.beesSignal.set([]);
    fixture.detectChanges();
    const gameOverMessageDebugElement = ngMocks.find(fixture, "[data-testid='game-over-message']");
    expect(gameOverMessageDebugElement).toBeTruthy();
  });
});
