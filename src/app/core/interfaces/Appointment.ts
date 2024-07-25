import { Location } from './Location';
import { AppointmentUserData } from './AppointmentUserData';
export interface Appointment {
  uid?: string;
  datetime: string;
  specialties: string[];
  patient: AppointmentUserData;
  professional: AppointmentUserData;
  location: Location;
  createdAt?: string;
  updatedAt?: string;
}