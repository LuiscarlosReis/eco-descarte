import { TestBed } from '@angular/core/testing';

import { DescarteService } from './descarte.service';

describe('DescarteService', () => {
  let service: DescarteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescarteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
