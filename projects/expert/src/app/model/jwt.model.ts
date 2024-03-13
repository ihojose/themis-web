/**
 * Copyright (c) 2024 Banco de Bogota. All Rights Reserved.
 * <p>
 * themis was developed by Transactional Squad.
 * <p>
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * proprietary and confidential. For use this code you need to contact to
 * Banco de Bogotá and request exclusive use permission.
 * <p>
 * This file was write by Jose Buelvas <jbuelva@bancodebogota.com.co>.
 */
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