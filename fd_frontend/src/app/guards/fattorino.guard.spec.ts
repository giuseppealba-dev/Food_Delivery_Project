import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { fattorinoGuard } from './fattorino.guard';

describe('fattorinoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => fattorinoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
