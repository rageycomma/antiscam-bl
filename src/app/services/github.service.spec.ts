import { TestBed } from '@angular/core/testing';

import { GithubLoginService } from './github.service';

describe('GithubLoginService', () => {
  let service: GithubLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
