import { TestBed } from '@angular/core/testing';

import { ShareModuleService } from './share-module.service';

describe('ShareModuleService', () => {
  let service: ShareModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
