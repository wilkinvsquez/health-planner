import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateAndTimePickerComponent } from './date-and-time-picker.component';

describe('DateAndTimePickerComponent', () => {
  let component: DateAndTimePickerComponent;
  let fixture: ComponentFixture<DateAndTimePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DateAndTimePickerComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DateAndTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
