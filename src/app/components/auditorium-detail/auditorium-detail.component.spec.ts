import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriumDetailComponent } from './auditorium-detail.component';

describe('AuditoriumDetailComponent', () => {
  let component: AuditoriumDetailComponent;
  let fixture: ComponentFixture<AuditoriumDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriumDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
