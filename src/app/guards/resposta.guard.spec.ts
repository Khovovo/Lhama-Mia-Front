import { TestBed } from '@angular/core/testing';

import { RespostaGuard } from './resposta.guard';

describe('RespostaGuard', () => {
  let guard: RespostaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RespostaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
