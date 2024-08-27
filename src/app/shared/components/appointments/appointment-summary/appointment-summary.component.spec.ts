import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppointmentSummaryComponent } from './appointment-summary.component';

describe('AppointmentSummaryComponent', () => {
  let component: AppointmentSummaryComponent;
  let fixture: ComponentFixture<AppointmentSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppointmentSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
