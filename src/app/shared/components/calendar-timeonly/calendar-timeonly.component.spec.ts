import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CalendarTimeonlyComponent } from './calendar-timeonly.component';

describe('CalendarTimeonlyComponent', () => {
  let component: CalendarTimeonlyComponent;
  let fixture: ComponentFixture<CalendarTimeonlyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CalendarTimeonlyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarTimeonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
