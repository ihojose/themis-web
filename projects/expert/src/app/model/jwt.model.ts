export interface JwtModel {
  jti: string;
  name: string;
  surname: string;
  username: string;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  name: string;
  description: string;
}
