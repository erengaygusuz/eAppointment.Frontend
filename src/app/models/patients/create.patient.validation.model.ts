import { GetAllCitiesQueryResponseModel } from '../cities/get.all.cities.query.response.model';
import { GetAllCountiesByCityIdQueryResponseModel } from '../counties/get.all.counties.by.city.id.query.response.model';

export class CreatePatientValidationModel {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  userName: string = '';
  identityNumber: string = '';
  city: GetAllCitiesQueryResponseModel = new GetAllCitiesQueryResponseModel();
  county: GetAllCountiesByCityIdQueryResponseModel =
    new GetAllCountiesByCityIdQueryResponseModel();
  fullAddress: string = '';
  password: string = '';
  passwordAgain: string = '';
}
