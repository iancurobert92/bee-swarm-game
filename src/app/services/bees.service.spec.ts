import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BeesService } from './bees.service';

describe('BeesService', () => {
  let service: BeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(BeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
