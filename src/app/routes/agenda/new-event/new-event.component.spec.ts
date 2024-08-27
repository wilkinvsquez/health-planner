import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewEventComponent } from './new-event.component';
import { provideToastr } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { provideRouter } from '@angular/router';

describe('NewEventComponent', () => {
  let component: NewEventComponent;
  let fixture: ComponentFixture<NewEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NewEventComponent, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        provideRouter([]),
        provideToastr({ timeOut: 3000, preventDuplicates: true })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
