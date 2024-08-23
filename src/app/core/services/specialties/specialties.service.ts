import { inject, Injectable, } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDocs, setDoc, } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
// Utils
import { generateUniqueId } from 'src/app/shared/utils/generateUuid';

// Interfaces
import { Response } from 'src/app/core/interfaces/Response';

@Injectable({
  providedIn: 'root'
})
export class SpecialtiesService {
  private firestore: Firestore = inject(Firestore);
  NAME_COLLECTION: string = environment.colletionName.specialties;

  constructor() { }

  /**
   * Create a new specialty in the Firestore database.
   * @param specialty  The data for the new specialty to be created.
   * @returns A promise that resolves with the ID of the newly created specialty.
   */
  async createSpecialty(specialty: any): Promise<Response> {
    const specialtyId = generateUniqueId();
    return await setDoc(doc(this.firestore, this.NAME_COLLECTION, specialtyId),
      { ...specialty, id: specialtyId }).then(() => {
        return { success: true, data: specialty, message: 'Success' };
      }).catch((error) => {
        return { success: false, data: error, message: 'Error' };
      });

  }

  /**
   * Retrieves all specialties from the Firestore database.
   * @returns A promise that resolves with an array containing the data of all specialties stored in the database.
   */
  async getSpecialties(): Promise<Response> {
    try {
      const specialties = await getDocs(
        collection(this.firestore, this.NAME_COLLECTION)).then((res) => { return res; }).catch((error) => { return error; });
      const docs = specialties.docs.map((doc: any) => doc.data());
      if (docs.length === 0) return { success: false, data: docs, message: 'No specialties found' }
      return { success: true, data: docs, message: 'Success' };
    } catch (error) {
      return { success: false, data: error, message: 'Error' };
    }
  }

  /**
   * Retrieves specialty data from the Firestore database based on the provided specialty ID.
   * @param specialty The ID of the specialty to retrieve.
   * @returns A promise that resolves with the specialty data matching the provided ID, or undefined if no specialty is found with the given ID.
   */
  async updateSpecialty(specialty: any): Promise<Response> {
    return await setDoc(doc(this.firestore, this.NAME_COLLECTION, specialty.id), specialty)
      .then(() => {
        return { success: true, data: specialty, message: 'Success' };
      }).catch((error) => { return { success: false, data: error, message: 'Error' }; });
  }

  /**
   * Deletes a specialty from the Firestore database based on the provided specialty ID.
   * @param specialtyId  The ID of the specialty to delete.
   * @returns A promise that resolves with the ID of the deleted specialty.
   */
  async deleteSpecialty(specialtyId: string): Promise<Response> {
    return await deleteDoc(doc(this.firestore, this.NAME_COLLECTION, specialtyId))
      .then(() => { return { success: true, data: specialtyId, message: 'Success' }; })
      .catch((error) => { return { success: false, data: error, message: 'Error' }; });
  }

  /**
   * Search specialties by any field
   * @param value The value to search for in any field of the specialties.
   * @returns A promise that resolves with an array containing the data of all specialties that match the provided value.
   */
  async searchSpecialtiesByAny(value: string): Promise<Response> {
    try {
      const specialtiesSnapshot = await getDocs(
        collection(this.firestore, this.NAME_COLLECTION)
      );
      const specialties = specialtiesSnapshot.docs.filter((doc) => {
        const data = doc.data();
        for (const key in data) {
          if (data[key] && data[key].toString().toLowerCase().includes(value.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
      const specialtiesData = specialties.map((doc: any) => doc.data());
      return { success: true, data: specialtiesData, message: 'Success' };
    } catch (error) {
      return { success: false, data: error, message: 'Error' };
    }
  }


}
