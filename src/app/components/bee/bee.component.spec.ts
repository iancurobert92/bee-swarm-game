import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { BeeType } from '../../enums/bee-type';
import { BeeComponent } from './bee.component';

describe('BeeComponent', () => {
  let component: BeeComponent;
  let fixture: MockedComponentFixture;
  const params = { type: BeeType.Queen, health: 100, imageUrl: '' };

  beforeEach(async () => {
    await MockBuilder(BeeComponent);
    fixture = MockRender(BeeComponent, params);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set image url', () => {
    expect(component.imageUrl).toBe(`${params.type.toLowerCase()}.svg`);
  });

  it('should display bee stats', () => {
    const statsDebugEl = ngMocks.find(fixture, '[data-testid="bee-stats"]');

    expect(statsDebugEl.nativeElement.textContent).toBe(`${params.type} Bee - ${params.health} HP`);
  });

  it('should display bee image', () => {
    const statsDebugEl = ngMocks.find(fixture, '[data-testid="bee-image"]');

    expect(statsDebugEl).toBeTruthy();
  });
});
