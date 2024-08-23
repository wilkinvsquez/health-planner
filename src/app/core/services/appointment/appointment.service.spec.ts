import { TestBed } from '@angular/core/testing';
import { AppointmentService } from './appointment.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let appId = 'iHAgiN_0MvE3Ln73UbK_d6eR6u'

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore())
      ],
    });
    setTimeout(() => {

    }, 3000);
    service = TestBed.inject(AppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('The test should create an appointment', async () => {
    const appointment = await service.createAppointment({
      "datetime": "2024-07-28T11:00:00.000Z",
      "location": {
        "address": "8H9C+2CQ, Ruta Nacional Secundaria 141, Provincia de Alajuela, Cd Quesada, Barrio Lourdes, Costa Rica",
        "lat": 10.317451,
        "lng": -84.428865
      },
      "patient": {
        "email": "yojeTest@gmail.com",
        "identification": "444444440",
        "lastname": "Murillo Flores",
        "name": "Yojeisi",
        "phoneNumber": "86813011",
        "uid": "JAddalAPwoTNuJJJo2pLm5jYBSq2"
      },
      "professional": {
        "email": "wilkinvsquez@gmail.com",
        "identification": "207650279",
        "lastname": "Vasquez",
        "name": "Wilkin",
        "phoneNumber": "85203542",
        "uid": "uZpG5AP28ThF8R2Je3I2VRHmQVk1"
      },
      "specialties": ["Cardiología"],
    })
    appId = appointment.data.uid
    expect(appointment).toEqual({ success: true, data: appointment.data, message: 'Success' });
    expect(appointment.data).toBeDefined();
    expect(appointment.message).toBe('Success');
  });

  it('The test should bring all appointments', async () => {
    const appointment = await service.getAppointments()
    if (appointment.data.length === 0) {
      expect(appointment.success).toEqual(true);
      expect(appointment.data.length).toBe(0);
      expect(appointment.message).toBe('No appointments found');
    } else {
      expect(appointment).toEqual({ success: true, data: appointment.data, message: 'Success' });
      expect(appointment.data.length).toBeGreaterThan(0);
      expect(appointment.message).toBe('Success');
    }
  });

  it('The test should bring an appointment by id', async () => {
    const appointment = await service.getAppointmentById('7g-YwnY2mTOKUmUtxW02Xv96GS')
    expect(appointment).toEqual({ success: true, data: appointment.data, message: 'Success' });
    expect(appointment.data).toBeDefined();
    expect(appointment.message).toBe('Success');
  });

  it('The test should bring all appointments by doctor', async () => {
    const appointment = await service.getAppointmentsByDoctor('uZpG5AP28ThF8R2Je3I2VRHmQVk1')
    expect(appointment).toEqual({ success: true, data: appointment.data, message: 'Success' });
    expect(appointment.data.length).toBeGreaterThan(0);
    expect(appointment.message).toBe('Success');
  });

  it('The test should update an appointment', async () => {
    const appointment = await service.updateAppointment('7g-YwnY2mTOKUmUtxW02Xv96GS', {
      "location": {
        "address": "8H9C+2CQ, Ruta Nacional Secundaria 141, Provincia de Alajuela, Cd Quesada, Barrio Lourdes, Costa Rica",
        "lat": 10.317451,
        "lng": -84.428865
      },

      "specialties": ["Cardiología"],
    })
    expect(appointment).toEqual({ success: true, data: appointment.data, message: 'Success' });
    expect(appointment.data).toBeDefined();
    expect(appointment.message).toBe('Success');
  });

  it('The test should delete an appointment', async () => {
    const appointment = await service.deleteAppointment(appId)
    expect(appointment).toEqual({ success: true, data: appointment.data, message: 'Success' });
    expect(appointment.data).toBeDefined();
    expect(appointment.message).toBe('Success');
  });

  it('The test should bring all appointments by patient', async () => {
    const appointment = await service.getAppointmentsByPatient('JAddalAPwoTNuJJJo2pLm5jYBSq2')
    expect(appointment).toEqual({ success: true, data: appointment.data, message: 'Success' });
    expect(appointment.data.length).toBeGreaterThan(0);
    expect(appointment.message).toBe('Success');
  });

  // it('The test should bring all the coincidences of the appointments in search', async () => {
  //   const appointment = await service.searchAppointments('Yoje');

  //   expect(appointment).toEqual({ success: true, data: appointment.data, message: 'Success' });
  //   expect(appointment.data.length).toBeGreaterThan(0);
  //   expect(appointment.message).toBe('Success');
  // });
});
