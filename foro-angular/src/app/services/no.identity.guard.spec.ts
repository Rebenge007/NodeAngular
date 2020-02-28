import { TestBed, async, inject } from '@angular/core/testing';

import { No.IdentityGuard } from './no.identity.guard';

describe('No.IdentityGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [No.IdentityGuard]
    });
  });

  it('should ...', inject([No.IdentityGuard], (guard: No.IdentityGuard) => {
    expect(guard).toBeTruthy();
  }));
});
