import { RoleModel } from './role.model';

export class TokenModel {
  id: string = '';
  name: string = '';
  email: string = '';
  userName: string = '';
  roles: RoleModel[] = [];
}
