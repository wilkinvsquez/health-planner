import { User } from './User';

export interface AppointmentUserData extends User {
    uid: string;
    name: string;
    lastname: string;
    identification: string;
    phoneNumber: string;
    email: string;
}