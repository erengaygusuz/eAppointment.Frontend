export class GetPatientProfileByIdQueryResponseModel {
  firstName: string = '';
  lastName: string = '';
  identityNumber: string = '';
  phoneNumber: string = '';
  email: string = '';
  userName: string = '';
  countyId: number = 0;
  cityId: number = 0;
  fullAddress: string = '';
  profilePhotoContentType: string = '';
  profilePhotoBase64Content: string = '';
}
