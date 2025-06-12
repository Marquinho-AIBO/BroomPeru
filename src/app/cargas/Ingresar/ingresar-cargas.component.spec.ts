import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarCargasComponent } from './ingresar-cargas.component';

describe('IngresarCargasComponent', () => {
  let component: IngresarCargasComponent;
  let fixture: ComponentFixture<IngresarCargasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresarCargasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngresarCargasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
