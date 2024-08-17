import { TestBed } from '@angular/core/testing';

import { AvailableSlotsService } from './available-slots.service';

describe('AvailableSlotsService', () => {
  let service: AvailableSlotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableSlotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
