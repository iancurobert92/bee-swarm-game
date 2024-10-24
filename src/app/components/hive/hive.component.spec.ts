import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { BeeType } from '../../enums/bee-type';
import { HiveComponent } from './hive.component';
import { BeeComponent } from '../bee/bee.component';

describe('HiveComponent', () => {
  let fixture: MockedComponentFixture;
  const params = {
    bees: [
      { type: BeeType.Queen, health: 100, damage: 8 },
      { type: BeeType.Worker, health: 75, damage: 10 },
      { type: BeeType.Worker, health: 75, damage: 10 },
      { type: BeeType.Drone, health: 50, damage: 12 },
    ],
  };

  beforeEach(async () => {
    await MockBuilder(HiveComponent).mock(BeeComponent);

    fixture = MockRender(HiveComponent, params);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should group bees by type', () => {
    expect(fixture.point.componentInstance.beeGroups.length).toEqual(3);
  });

  it('should render bee groups', () => {
    const beeGroupDebugElements = ngMocks.findAll(fixture, "[data-testid='bee-group']");

    expect(beeGroupDebugElements.length).toEqual(3);
  });

  it('should render bees', () => {
    const beesDebugElements = ngMocks.findAll(fixture, "[data-testid='bee']");

    expect(beesDebugElements.length).toEqual(params.bees.length);
  });
});
