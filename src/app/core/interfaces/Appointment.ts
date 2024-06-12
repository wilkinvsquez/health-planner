export interface Appointment {
  uid?: string;
  date: string;
  time: string;
  specialty: string;
  patient: object;
  doctor: object;
  location: object;
  createdAt: string;
  updatedAt: string;
}
