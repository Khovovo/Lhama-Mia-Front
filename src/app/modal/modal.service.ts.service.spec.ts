import { TestBed } from '@angular/core/testing';

import { Modal.Service.TsService } from './modal.service.ts.service';

describe('Modal.Service.TsService', () => {
  let service: Modal.Service.TsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Modal.Service.TsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
