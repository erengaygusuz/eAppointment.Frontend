export class UpdatePatientProfileByIdCommandModel {
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  countyId: string = '';
  fullAddress: string = '';
  profilePhoto: File = new File([], '');
  email: string = '';
  userName: string = '';
}
