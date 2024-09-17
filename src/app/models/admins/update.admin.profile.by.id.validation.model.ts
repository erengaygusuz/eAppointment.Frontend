export class UpdateAdminProfileByIdValidationModel {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  profilePhoto: File = new File([], '');
  email: string = '';
  userName: string = '';
}
