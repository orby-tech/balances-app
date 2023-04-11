import { TestBed } from '@angular/core/testing';

import { BalancesService } from './balances.service';

describe('BalancesService', () => {
  let service: BalancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
