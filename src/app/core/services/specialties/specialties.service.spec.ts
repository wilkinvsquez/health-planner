import { TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { SpecialtiesService } from './specialties.service';

describe('SpecialtiesService', () => {
  let service: SpecialtiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore())
      ],
    });
    service = TestBed.inject(SpecialtiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('The test should create a specialty', async () => {
    const specialty = await service.createSpecialty({
      "name": "Cardiología",
      "description": "Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón y del aparato circulatorio.",
    })
    expect(specialty.success).toEqual(true);
    expect(specialty.data).toBeDefined();
    expect(specialty.message).toBe('Success');
  });

  it('The test should bring all specialties', async () => {
    const specialties = await service.getSpecialties();
    if (specialties.data.length === 0) {
      expect(specialties.success).toEqual(true);
      expect(specialties.data.length).toBe(0);
      expect(specialties.message).toBe('No specialties found');
    } else {
      expect(specialties.success).toEqual(true);
      expect(specialties.data.length).toBeGreaterThan(0);
      expect(specialties.message).toBe('Success');
    }
  });

  it('The test should update a specialty', async () => {
    const specialties = await service.getSpecialties();
    const specialty = specialties.data[0];
    specialty.description = "Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón y del aparato circulatorio.";
    const updatedSpecialty = await service.updateSpecialty(specialty);
    expect(updatedSpecialty.success).toEqual(true);
    expect(updatedSpecialty.data).toBeDefined();
    expect(updatedSpecialty.message).toBe('Success');
  })

  it('The test should delete a specialty', async () => {
    const specialties = await service.deleteSpecialty('MkjmBoe8Mb0E0K-1ehVVkiB9Vm');
    expect(specialties.success).toEqual(true);
    expect(specialties.data).toBeDefined();
    expect(specialties.message).toBe('Success');
  });
});
