import { FilterMetadata } from 'primeng/api';

export class GetAllUsersQueryModel {
  first: number = 0;
  rows: number = 0;
  sortField: string = '';
  sortOrder: number = 0;
  multiSortMeta: object = {};
  filters:
    | { [s: string]: FilterMetadata[] | FilterMetadata | undefined }
    | undefined = {};
  globalFilter: string = '';
}
