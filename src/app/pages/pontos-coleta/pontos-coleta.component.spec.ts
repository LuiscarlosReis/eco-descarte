import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PontosColetaComponent } from './pontos-coleta.component';

describe('PontosColetaComponent', () => {
  let component: PontosColetaComponent;
  let fixture: ComponentFixture<PontosColetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PontosColetaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PontosColetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
