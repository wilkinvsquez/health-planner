import { TestBed } from '@angular/core/testing';
import { AppointmentService } from './appointment.service';
import { getDocs, collection } from 'firebase/firestore';

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppointmentService,
        { provide: getDocs, useValue: jasmine.createSpy() },
        { provide: collection, useValue: jasmine.createSpy() }
      ]
    });
    service = TestBed.inject(AppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return no appointments found if snapshot is empty', async () => {
    // Mock the Firestore response for an empty appointments snapshot
    spyOn<any>(global, 'getDocs').and.returnValue(Promise.resolve({ empty: true, docs: [] }));

    const response = await service.getAppointmentsByPatient('uZpG5AP28ThF8R2Je3I2VRHmQVk1');
    expect(response).toEqual({ success: false, data: [], message: 'No appointments found' });
  });

  it('should return no appointments found if no matching appointments', async () => {
    // Mock the Firestore response for non-empty snapshot but no matching appointments
    const mockDocs = [{ data: () => ({ patient: { uid: 'differentUserId' } }) }];
    spyOn<any>(global, 'getDocs').and.returnValue(Promise.resolve({ empty: false, docs: mockDocs }));

    const response = await service.getAppointmentsByPatient('uZpG5AP28ThF8R2Je3I2VRHmQVk1');
    expect(response).toEqual({ success: false, data: [], message: 'No appointments found' });
  });

  it('should return success if matching appointments are found', async () => {
    // Mock the Firestore response for non-empty snapshot with matching appointments
    const mockDocs = [{ data: () => ({ patient: { uid: 'uZpG5AP28ThF8R2Je3I2VRHmQVk1' }, details: 'appointment1' }) }];
    spyOn<any>(global, 'getDocs').and.returnValue(Promise.resolve({ empty: false, docs: mockDocs }));

    const response = await service.getAppointmentsByPatient('uZpG5AP28ThF8R2Je3I2VRHmQVk1');
    expect(response).toEqual({ success: true, data: [{ patient: { uid: 'uZpG5AP28ThF8R2Je3I2VRHmQVk1' }, details: 'appointment1' }], message: 'Success' });
  });
});
