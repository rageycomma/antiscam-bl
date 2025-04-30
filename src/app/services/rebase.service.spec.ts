import { TestBed } from '@angular/core/testing';

import { RebaseService } from './rebase.service';

describe('RebaseService', () => {
  let service: RebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
