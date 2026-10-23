import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescartesComponent } from './descartes.component';

describe('DescartesComponent', () => {
  let component: DescartesComponent;
  let fixture: ComponentFixture<DescartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescartesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DescartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
