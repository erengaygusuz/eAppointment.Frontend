export class UpdateAdminProfileByIdCommandModel {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  profilePhoto: File = new File([], '');
}
