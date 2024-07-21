import { User } from './User';
import { Location } from './Location';

export interface Appointment {
  uid?: string;
  datetime: string;
  specialties: string[];
  patient: User;//[ {uid: "doahdkjasndas", nombre completo},{uid: "doahdkjasndas"}]
  professional: User;
  location: Location;
  createdAt: string;
  updatedAt: string;
}
