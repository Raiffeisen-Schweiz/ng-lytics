import { TestBed } from '@angular/core/testing';

import { NgLyticsService } from './ng-lytics.service';

describe('NgLyticsService', () => {
  let service: NgLyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgLyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
