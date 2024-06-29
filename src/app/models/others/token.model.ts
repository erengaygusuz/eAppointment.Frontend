import { GetAllRolesQueryResponseModel } from '../roles/get.all.roles.query.response.model';

export class TokenModel {
  id: string = '';
  name: string = '';
  email: string = '';
  userName: string = '';
  patientId: string = '';
  roles: GetAllRolesQueryResponseModel[] = [];
}
