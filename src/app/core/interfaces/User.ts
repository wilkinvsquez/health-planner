export interface User {
  identification?: string;
  name: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
  password: string;
  userRelations?: Array<object>;
  role: string;
  active: boolean;
}
