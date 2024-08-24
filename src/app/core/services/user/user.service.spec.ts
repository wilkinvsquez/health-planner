import { TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';


describe('UserService', () => {
  let service: UserService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('The test should get all users', async () => {
    const users = await service.getUsers()
    if (users.data.length === 0) {
      expect(users.success).toEqual(true);
      expect(users.data.length).toBe(0);
      expect(users.message).toBe('No users found');
    } else {
      expect(users).toEqual({ success: true, data: users.data, message: 'Success' });
      expect(users.data.length).toBeGreaterThan(0);
      expect(users.message).toBe('Success');
    }
  });

  it('Test should get all patients', async () => {
    const patients = await service.getPatients()
    if (patients.data.length === 0) {
      expect(patients.success).toEqual(true);
      expect(patients.data.length).toBe(0);
      expect(patients.message).toBe('No patients found');
    } else {
      expect(patients.success).toEqual(true);
      expect(patients.data.length).toBeGreaterThan(0);
      expect(patients.message).toBe('Success');
    }
  });

  it('Test should get all doctors', async () => {
    const doctors = await service.getProfessionals()
    if (doctors.data.length === 0) {
      expect(doctors.success).toEqual(true);
      expect(doctors.data.length).toBe(0);
      expect(doctors.message).toBe('No doctors found');
    } else {
      expect(doctors.success).toEqual(true);
      expect(doctors.data.length).toBeGreaterThan(0);
      expect(doctors.message).toBe('Success');
    }
  });

  it('Test should get a user by id', async () => {
    const user = await service.getUserById('RgLF4EZhwGSGHNwtjotf8651NGm2')
    if (user.data === undefined) {
      expect(user.success).toEqual(true);
      expect(user.data).toBeUndefined();
      expect(user.message).toBe('No user found');
    } else {
      expect(user.success).toEqual(true);
      expect(user.data).toBeDefined();
      expect(user.message).toBe('Success');
    }
  });

  it('The test should update a user', async () => {
    const user = await service.updateUserDB({ name: 'Wil location' }, 'RgLF4EZhwGSGHNwtjotf8651NGm2')
    expect(user.success).toEqual(true);
    expect(user.data).toBeDefined();
    expect(user.message).toBe('Success');
  });

});
