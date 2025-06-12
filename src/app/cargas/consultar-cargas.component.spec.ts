import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarCargasComponent } from './consultar-cargas.component';

describe('ConsultarCargasComponent', () => {
  let component: ConsultarCargasComponent;
  let fixture: ComponentFixture<ConsultarCargasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarCargasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultarCargasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
