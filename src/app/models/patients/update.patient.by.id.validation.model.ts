import { GetAllCitiesQueryResponseModel } from '../cities/get.all.cities.query.response.model';
import { GetAllCountiesByCityIdQueryResponseModel } from '../counties/get.all.counties.by.city.id.query.response.model';

export class UpdatePatientByIdValidationModel {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  userName: string = '';
  email: string = '';
  identityNumber: string = '';
  city: GetAllCitiesQueryResponseModel = new GetAllCitiesQueryResponseModel();
  county: GetAllCountiesByCityIdQueryResponseModel =
    new GetAllCountiesByCityIdQueryResponseModel();
  fullAddress: string = '';
}
