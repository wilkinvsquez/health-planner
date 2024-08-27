import { TestBed } from '@angular/core/testing';
import { AvailableSlotsService } from './available-slots.service';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

describe('AvailableSlotsService', () => {
  let service: AvailableSlotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        importProvidersFrom(HttpClientModule,
          CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
          }),
        ),
      ],
    });
    service = TestBed.inject(AvailableSlotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('The test should get available slots', async () => {
    const availableSlots = await service.getAvailableSlots({
      "selectedDate": "2024-08-27T11:00:00.000Z",
      "location": {

        "lat": 10.317451,
        "lng": -84.428865
      },
      "professional": {
        "uid": "uZpG5AP28ThF8R2Je3I2VRHmQVk1"
      },
    })
    if (availableSlots.data.length === 0) {
      expect(availableSlots.success).toEqual(true);
      expect(availableSlots.data.length).toBe(0);
      expect(availableSlots.message).toBe('No slots found');
    } else {
      expect(availableSlots.success).toEqual(true);
      expect(availableSlots.data.length).toBeGreaterThan(0);
      expect(availableSlots.message).toBe('Successfull');
    }
  });


});
