import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { MockBuilder, MockedComponentFixture, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';
import { AppComponent } from './app.component';
import { HiveComponent } from './components/hive/hive.component';
import { BeeType } from './enums/bee-type';

describe('AppComponent', () => {
  let fixture: MockedComponentFixture;

  beforeEach(async () => {
    await MockBuilder(AppComponent).provide([provideHttpClient(), provideHttpClientTesting()]).mock(HiveComponent);

    fixture = MockRender(AppComponent);
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render player details', () => {
    const playerName = 'Player 1';
    fixture.point.componentInstance.playerName = playerName;
    const playerNameDebugElement = ngMocks.find(fixture, "[data-testid='player-details']");
    expect(ngMocks.formatText(playerNameDebugElement)).toBe(`Player name: ${playerName}`);
  });

  describe('Hit button', () => {
    let hitButtonDebugElement: MockedDebugElement;

    beforeEach(() => {
      hitButtonDebugElement = ngMocks.find(fixture, "[data-testid='hit-button']");
    });

    it('should render', () => {
      expect(hitButtonDebugElement).toBeTruthy();
    });

    it('should be enabled when the game starts', () => {
      fixture.point.componentInstance.bees = signal([
        { type: BeeType.Queen, health: 100, damage: 8 },
        { type: BeeType.Worker, health: 75, damage: 10 },
        { type: BeeType.Worker, health: 75, damage: 10 },
        { type: BeeType.Drone, health: 50, damage: 12 },
      ]);
      fixture.detectChanges();
      expect(hitButtonDebugElement.nativeElement.disabled).toBeFalse();
    });

    it('should be disabled when the game is over', () => {
      fixture.point.componentInstance.bees = signal([]);
      fixture.detectChanges();
      expect(hitButtonDebugElement.nativeElement.disabled).toBeTrue();
    });
  });

  it('should hit a random bee', () => {
    spyOn(fixture.point.componentInstance, 'onHitButtonClick');
    fixture.point.componentInstance.bees = signal([
      { type: BeeType.Queen, health: 100, damage: 8 },
      { type: BeeType.Worker, health: 75, damage: 10 },
      { type: BeeType.Worker, health: 75, damage: 10 },
      { type: BeeType.Drone, health: 50, damage: 12 },
    ]);
    fixture.detectChanges();
    const hitButtonDebugElement = ngMocks.find(fixture, "[data-testid='hit-button']");
    ngMocks.click(hitButtonDebugElement);
    expect(fixture.point.componentInstance.onHitButtonClick).toHaveBeenCalled();
  });

  it('should restart the game', () => {
    spyOn(fixture.point.componentInstance, 'onRestartButtonClick');
    fixture.point.componentInstance.bees = signal([]);
    fixture.detectChanges();
    const restartButtonDebugElement = ngMocks.find(fixture, "[data-testid='restart-button']");
    ngMocks.click(restartButtonDebugElement);
    expect(fixture.point.componentInstance.onRestartButtonClick).toHaveBeenCalled();
  });

  it('should render the TYPE of the hit bee', () => {
    const targetBee = { type: BeeType.Queen, health: 100, damage: 8 };
    fixture.point.componentInstance.targetBee = targetBee;
    fixture.detectChanges();
    const hitBeeTypeDebugElement = ngMocks.find(fixture, "[data-testid='target-bee-type']");
    expect(ngMocks.formatText(hitBeeTypeDebugElement)).toBe(`Target Bee Type: ${targetBee.type}`);
  });

  it('should render the DAMAGE of the hit bee', () => {
    const targetBee = { type: BeeType.Queen, health: 100, damage: 8 };
    fixture.point.componentInstance.targetBee = targetBee;
    fixture.detectChanges();
    const hitBeeDamageDebugElement = ngMocks.find(fixture, "[data-testid='target-bee-damage']");
    expect(ngMocks.formatText(hitBeeDamageDebugElement)).toBe(`Damage: ${targetBee.damage}`);
  });

  it('should render the "Game Over" message', () => {
    fixture.point.componentInstance.bees = signal([]);
    fixture.detectChanges();
    const gameOverMessageDebugElement = ngMocks.find(fixture, "[data-testid='game-over-message']");
    expect(gameOverMessageDebugElement).toBeTruthy();
  });
  it('should render the "Restart" button', () => {
    fixture.point.componentInstance.bees = signal([]);
    fixture.detectChanges();
    const restartButtonDebugElement = ngMocks.find(fixture, "[data-testid='restart-button']");
    expect(restartButtonDebugElement).toBeTruthy();
  });
  it('should render the Hive', () => {
    fixture.point.componentInstance.bees = signal([
      { type: BeeType.Queen, health: 100, damage: 8 },
      { type: BeeType.Worker, health: 75, damage: 10 },
      { type: BeeType.Worker, health: 75, damage: 10 },
      { type: BeeType.Drone, health: 50, damage: 12 },
    ]);
    fixture.detectChanges();
    const hiveComponent = ngMocks.findInstance(HiveComponent);
    expect(hiveComponent).toBeTruthy();
  });
});
