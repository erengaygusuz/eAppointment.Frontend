export class UpdateAdminProfileByIdValidationModel {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  profilePhoto: FormData = new FormData();
  email: string = '';
  userName: string = '';
}
