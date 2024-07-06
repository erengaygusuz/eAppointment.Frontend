import { GetAllDepartmentsQueryResponseModel } from '../departments/get.all.departments.query.response.model';

export class CreateDoctorValidationModel {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  userName: string = '';
  department: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();
  password: string = '';
  passwordAgain: string = '';
}
