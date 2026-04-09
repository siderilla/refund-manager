import { TestBed } from '@angular/core/testing';

import { Outlay } from './outlay';

describe('Outlay', () => {
  let service: Outlay;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Outlay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
