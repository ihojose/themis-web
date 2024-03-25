import { TestBed } from '@angular/core/testing';

import { DecisionTreeService } from './decision-tree.service';

describe('DecisionTreeService', () => {
  let service: DecisionTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecisionTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
