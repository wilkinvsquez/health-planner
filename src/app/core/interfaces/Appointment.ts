import { User } from './User';
import { Location } from './Location';

export interface Appointment {
  uid?: string;
  datetime: string;
  specialties: string[];
  patient: User;
  professional: User;
  location: Location;
  createdAt: string;
  updatedAt: string;
}
