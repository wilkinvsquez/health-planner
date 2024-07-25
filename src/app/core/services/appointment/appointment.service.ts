import { collection, deleteDoc, Firestore, getDoc, getDocs, setDoc, updateDoc, doc } from '@angular/fire/firestore';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/** Interfaces */
import { Appointment } from '../../interfaces/Appointment';
import { Response } from '../../interfaces/Response';

/** Utils */
import { generateUniqueId } from 'src/app/shared/utils/generateUuid';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private firestore: Firestore = inject(Firestore);

  NAME_COLLECTION: string = environment.colletionName.appointments;

  constructor() { }

  /**
   * Retrieves all appointment data from the Firestore database.
   * @returns A promise that resolves with an array containing the data of all appointments stored in the database.
   */
  async getAppointments(): Promise<Response> {
    const appointments = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    if (appointments.empty) return { success: false, data: [], message: 'No appointments found' };
    const docs = appointments.docs.map((doc: any) => doc.data());
    return { success: true, data: docs, message: 'Success' };
  }

  /**
   * Retrieves appointment data from the Firestore database based on the provided appointment ID.
   * @param id  The ID of the appointment to retrieve.
   * @returns   A promise that resolves with the appointment data matching the provided ID, or undefined if no appointment is found with the given ID.
   */
  async getAppointmentById(id: string): Promise<Response> {
    const appointment = await getDoc(doc(this.firestore, this.NAME_COLLECTION, id));
    if (!appointment.exists()) return { success: false, data: null, message: 'Appointment not found' };
    return { success: true, data: appointment.data(), message: 'Success' };
  }

  /**
   * Retrieves all appointments from the Firestore database that match the provided user ID.
   * @param userId  The ID of the user to retrieve appointments for.
   * @returns A promise that resolves with an array containing the data of all appointments that match the provided user ID.
   */
  async getAppointmentsByDoctor(userId: string): Promise<Response> {
    const appointmentsSnapshot = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    if (appointmentsSnapshot.empty) return { success: false, data: [], message: 'No appointments found' };
    const appointments = appointmentsSnapshot.docs.filter((doc) => {
      const appointmentData = doc.data();
      return appointmentData['professional'].uid === userId;
    });
    if (appointments.length === 0) return { success: false, data: [], message: 'No appointments found' };
    const docs = appointments.map((doc: any) => doc.data());
    return { success: true, data: docs, message: 'Success' };
  }

  /**
   * Retrieves all appointments from the Firestore database that match the provided user ID.
   * @param userId  The ID of the user to retrieve appointments for.
   * @returns A promise that resolves with an array containing the data of all appointments that match the provided user ID.
   */
  async getAppointmentsByPatient(userId: string): Promise<Response> {
    const appointmentsSnapshot = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    if (appointmentsSnapshot.empty) return { success: false, data: [], message: 'No appointments found' };
    const appointments = appointmentsSnapshot.docs.filter((doc) => {
      const appointmentData = doc.data();
      return appointmentData['patient'].uid === userId;
    });
    if (appointments.length === 0) return { success: false, data: [], message: 'No appointments found' };
    const docs = appointments.map((doc: any) => doc.data());
    return { success: true, data: docs, message: 'Success' };
  }

  /**
   * Creates a new appointment in the Firestore database.
   * @param appointment The appointment data to create.
   * @returns A promise that resolves with the newly created appointment data after the operation has completed in the database.
   */
  async createAppointment(appointment: Appointment): Promise<Response> {
    const appId = generateUniqueId();
    return await setDoc(doc(this.firestore, this.NAME_COLLECTION, appId), {
      ...appointment,
      uid: appId,
    }).then(() => {
      return { success: true, data: appointment, message: 'Success' };
    }).catch((error) => {
      return { success: false, data: error.code, message: error.message };
    });
  }

  /**
   * Updates an existing appointment in the Firestore database.
   * @param id The ID of the appointment to update.
   * @param data The updated appointment data.
   * @returns A promise that resolves with the updated appointment data after the operation has completed in the database.
   */
  async updateAppointment(id: string, data: any): Promise<Response> {
    return await updateDoc(doc(this.firestore, this.NAME_COLLECTION, id), data).then(() => {
      return { success: true, data: data, message: 'Success' };
    }).catch((error) => {
      return { success: false, data: error.code, message: error.message };
    });
  }

  /**
   * Deletes an appointment from the Firestore database based on the provided appointment ID.
   * @param id The ID of the appointment to delete.
   * @returns A promise that resolves once the appointment document is successfully deleted from the database.
   */
  async deleteAppointment(id: string): Promise<Response> {
    return await deleteDoc(doc(this.firestore, this.NAME_COLLECTION, id))
      .then(() => {
        return { success: true, data: id, message: 'Success' };
      }).catch((error) => {
        return { success: false, data: error.code, message: error.message };
      });
  }

  /**
   * Searches for appointments in the Firestore database that match the provided search value.
   * @param value The search value to match against appointments.
   * @returns A promise that resolves with an array containing the data of all appointments that match the provided search value.
   */
  async searchAppointments(value: string): Promise<Response> {
    try {
      const appointmentsSnapshot = await getDocs(
        collection(this.firestore, this.NAME_COLLECTION)
      );
      if (appointmentsSnapshot.empty) return { success: false, data: [], message: 'No appointments found' };
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
      if (matchingAppointments.length === 0) return { success: false, data: [], message: 'No appointments found' };
      const appointmentData = matchingAppointments.map((doc) => doc.data());
      return { success: true, data: appointmentData, message: 'Success' };
    } catch (error: any) {
      return { success: false, data: error.code ? error.code : error, message: 'Error' };
    }
  }
}
