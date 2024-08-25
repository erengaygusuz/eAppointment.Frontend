export class GetAllUsersQueryModel {
  skip: number = 0;
  take: number = 0;
  sortFields: string = '';
  sortOrders: string = '';
  searchTerm: string = '';
}
