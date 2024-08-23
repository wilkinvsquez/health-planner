import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AppointmentFilterComponent } from './appointment-filter.component';
import { environment } from 'src/environments/environment';

describe('AppointmentFilterComponent', () => {
  let component: AppointmentFilterComponent;
  let fixture: ComponentFixture<AppointmentFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppointmentFilterComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
