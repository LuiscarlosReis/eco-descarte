import { TestBed } from '@angular/core/testing';

import { PontoColetaService } from './ponto-coleta.service';

describe('PontoColetaService', () => {
  let service: PontoColetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PontoColetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
