import { TestBed } from '@angular/core/testing';

import { DemandaCrearGuard } from './demanda-crear.guard';

describe('DemandaCrearGuard', () => {
  let guard: DemandaCrearGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DemandaCrearGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});