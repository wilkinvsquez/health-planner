import {
  inject,
  Injectable,
} from '@angular/core';
import {
  collection,
  deleteDoc,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

import { doc } from 'firebase/firestore';
import { generateUniqueId } from 'src/app/shared/utils/generateUuid';
import { environment } from 'src/environments/environment';

import { Appointment } from '../../interfaces/Appointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private firestore: Firestore = inject(Firestore);

  NAME_COLLECTION: string = environment.colletionName.appointments;

  constructor() {}

  /**
   * Retrieves all appointment data from the Firestore database.
   * @returns A promise that resolves with an array containing the data of all appointments stored in the database.
   */
  async getAppointments() {
    const appointments = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    return appointments.docs.map((doc: any) => doc.data());
  }

  /**
   * Retrieves appointment data from the Firestore database based on the provided appointment ID.
   * @param id  The ID of the appointment to retrieve.
   * @returns   A promise that resolves with the appointment data matching the provided ID, or undefined if no appointment is found with the given ID.
   */
  async getAppointmentById(id: string) {
    return (await getDoc(doc(this.firestore, this.NAME_COLLECTION, id))).data();
  }

  /**
   * Retrieves all appointments from the Firestore database that match the provided user ID.
   * @param userId  The ID of the user to retrieve appointments for.
   * @returns A promise that resolves with an array containing the data of all appointments that match the provided user ID.
   */
  async getAppointmentsByDoctor(userId: string) {
    const appointmentsSnapshot = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    const appointments = appointmentsSnapshot.docs.filter((doc) => {
      const appointmentData = doc.data();
      return appointmentData['doctor'].uid === userId;
    });
    return appointments.map((doc) => doc.data());
  }

  /**
   * Retrieves all appointments from the Firestore database that match the provided user ID.
   * @param userId  The ID of the user to retrieve appointments for.
   * @returns A promise that resolves with an array containing the data of all appointments that match the provided user ID.
   */
  async getAppointmentsByPatient(userId: string) {
    const appointmentsSnapshot = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    const appointments = appointmentsSnapshot.docs.filter((doc) => {
      const appointmentData = doc.data();
      return appointmentData['patient'].uid === userId;
    });
    return appointments.map((doc) => doc.data());
  }

  /**
   * Creates a new appointment in the Firestore database.
   * @param appointment The appointment data to create.
   * @returns A promise that resolves with the newly created appointment data after the operation has completed in the database.
   */
  async createAppointment(appointment: Appointment) {
    const appId = generateUniqueId();
    return await setDoc(doc(this.firestore, this.NAME_COLLECTION, appId), {
      ...appointment,
      uid: appId,
    });
  }

  /**
   * Updates an existing appointment in the Firestore database.
   * @param id The ID of the appointment to update.
   * @param data The updated appointment data.
   * @returns A promise that resolves with the updated appointment data after the operation has completed in the database.
   */
  async updateAppointment(id: string, data: any) {
    return await updateDoc(doc(this.firestore, this.NAME_COLLECTION, id), data);
  }

  /**
   * Deletes an appointment from the Firestore database based on the provided appointment ID.
   * @param id The ID of the appointment to delete.
   * @returns A promise that resolves once the appointment document is successfully deleted from the database.
   */
  async deleteUser(id: string) {
    return await deleteDoc(doc(this.firestore, this.NAME_COLLECTION, id));
  }

  /**
   * Searches for appointments in the Firestore database that match the provided search value.
   * @param value The search value to match against appointments.
   * @returns A promise that resolves with an array containing the data of all appointments that match the provided search value.
   */
  async searchAppointments(value: string) {
    const appointmentsSnapshot = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    const matchingAppointments = appointmentsSnapshot.docs.filter((doc) => {
      const appointmentData = doc.data();
      for (const key in appointmentData) {
        if (
          appointmentData[key] &&
          appointmentData[key]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
    const appointmentData = matchingAppointments.map((doc) => doc.data());
    return appointmentData;
  }
}
