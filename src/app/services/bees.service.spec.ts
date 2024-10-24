import { TestBed } from '@angular/core/testing';

import { BeesService } from './bees.service';

describe('BeesService', () => {
  let service: BeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
