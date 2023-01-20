import { TestBed } from '@angular/core/testing';

import { SavedContestsService } from './saved-contests.service';

describe('SavedContestsService', () => {
  let service: SavedContestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedContestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
