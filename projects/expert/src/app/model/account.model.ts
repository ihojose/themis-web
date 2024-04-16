export interface AccountModel {
  identification: number;
  id_type: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  password?: string;
  reg_date?: string;
  active?: number;
  role?: number;
}
