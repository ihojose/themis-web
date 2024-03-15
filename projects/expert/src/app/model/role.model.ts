import { PermissionModel } from "./permission.model";

export interface RoleModel {
  id: number;
  name: string;
  description: string;
  permissions?: PermissionModel[];
}
