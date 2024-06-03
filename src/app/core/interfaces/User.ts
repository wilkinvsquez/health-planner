export interface User {
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
  role?: string;
  active?: boolean;
}
