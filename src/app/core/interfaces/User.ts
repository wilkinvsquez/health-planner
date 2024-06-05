export interface User {
  uid?: string;
  identification?: string;
  name: string;
  lastname: string;
  birthday?: string;
  email: string;
  phoneNumber?: string;
  district?: string;
  canton?: string;
  password?: string;
  userRelations?: Array<object>;
  appointments?: Array<object>;
  notes?: Array<object>;
  role?: string;
  active?: boolean;
}
