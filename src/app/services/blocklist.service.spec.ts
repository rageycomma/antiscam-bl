import { TestBed } from '@angular/core/testing';

import { BlocklistService } from './blocklist.service';

describe('BlocklistService', () => {
  let service: BlocklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlocklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
