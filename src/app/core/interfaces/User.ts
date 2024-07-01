export interface User {
  uid?: string;
  identification?: string;
  name: string;
  lastname: string;
  birthdate?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  lat?: number;
  lng?: number;
  password?: string;
  photoURL?: string;
  userRelations?: Array<object>;
  appointments?: Array<object>;
  notes?: Array<object>;
  role?: string;
  active?: boolean;
  createdat?: String;
  updatedat?: String;
}
