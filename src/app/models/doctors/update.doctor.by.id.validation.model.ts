import { GetAllDepartmentsQueryResponseModel } from '../departments/get.all.departments.query.response.model';

export class UpdateDoctorByIdValidationModel {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  userName: string = '';
  email: string = '';
  department: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();
}
