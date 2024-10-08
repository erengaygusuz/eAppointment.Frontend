export class UpdatePatientProfileByIdCommandModel {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  countyId: string = '';
  fullAddress: string = '';
  profilePhoto: File = new File([], '');
  email: string = '';
  userName: string = '';
}
