import { GetAllDepartmentsQueryResponseModel } from '../departments/get.all.departments.query.response.model';

export class UpdateDoctorProfileByIdValidationModel {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  profilePhoto: File = new File([], '');
  email: string = '';
  userName: string = '';
  department: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();
}
