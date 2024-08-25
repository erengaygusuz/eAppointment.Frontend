import { GetAllUsersQueryResponseModel } from './get.all.users.query.response.model';

export class GetAllUsersQueryTableResponseModel {
  getAllUsersQueryResponse: GetAllUsersQueryResponseModel[] = [];
  totalCount: number = 0;
  filteredCount: number = 0;
}
