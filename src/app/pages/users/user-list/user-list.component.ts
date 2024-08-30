import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { AdvancedTableComponent } from '../../../components/advanced-table/advanced-table.component';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  FilterMetadata
} from 'primeng/api';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';
import { GetAllUsersQueryResponseModel } from '../../../models/users/get.all.users.query.response.model';
import { TableLazyLoadEvent } from 'primeng/table';
import { Router } from '@angular/router';
import { DeleteUserByIdCommandModel } from '../../../models/users/delete.user.by.id.command.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdvancedTableColumnInfoModel } from '../../../models/others/advanced.table.column.info.model';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GetAllUsersQueryModel } from '../../../models/users/get.all.users.query.model';
import { GetAllUsersQueryTableResponseModel } from '../../../models/users/get.all.users.query.table.response.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    AdvancedTableComponent,
    TranslateModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  providers: [MessageService, ConfirmationService]
})
export class UserListComponent implements OnInit {
  users: GetAllUsersQueryResponseModel[] = [];

  pageTitle: string = '';

  items: MenuItem[] = [{ label: '' }, { label: '' }];
  home: MenuItem | undefined;

  columns: AdvancedTableColumnInfoModel[] = [];

  tableName: string = 'usersTable';

  confirmationDialogMessage: string = '';
  confirmationDialogHeader: string = '';
  userFullNameWillBeDeleted: string = '';

  totalRecords: number = 0;
  loading: boolean = true;
  searchTerm: string = '';
  rowsPerPage: number = 5;

  filters:
    | { [s: string]: FilterMetadata[] | FilterMetadata | undefined }
    | undefined = {};

  multiSortMeta: object = {};

  globalFilter: object = {};

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    this.columns = [
      {
        field: 'fullName',
        sortField: 'FirstName',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'email',
        sortField: 'Email',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'userName',
        sortField: 'UserName',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'roleNames',
        sortField: '',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: false
      },
      {
        field: '',
        sortField: '',
        header: '',
        isSeverity: false,
        isOperationColumn: true,
        isFilterableAndSortable: false
      }
    ];

    if (localStorage.getItem('language')) {
      this.translate.use(localStorage.getItem('language')!);
    } else {
      this.translate.use('tr-TR');
    }

    this.getTranslationData('Pages.AllUsers');

    this.translate.onLangChange.subscribe(() => {
      this.getTranslationData('Pages.AllUsers');
    });
  }

  getTranslationData(key: string) {
    this.translate.get(key).subscribe(data => {
      this.items = this.items?.map((element, index) => {
        return { ...element, label: data.BreadcrumbItems[index].Name };
      });
      this.pageTitle = data.Title;

      this.columns = this.columns?.map((element, index) => {
        return {
          ...element,
          header: data.UsersTable.ColumnHeaders[index].Name
        };
      });

      this.confirmationDialogMessage =
        data.UsersTable.ConfimationDialog.Message;
      this.confirmationDialogHeader = data.UsersTable.ConfimationDialog.Header;
    });
  }

  ngOnInit(): void {
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };
  }

  getAllUsers(
    first: number,
    rows: number,
    sortField: string,
    sortOrder: number
  ) {
    const getAllUsersRequestBody = new GetAllUsersQueryModel();

    getAllUsersRequestBody.first = first;
    getAllUsersRequestBody.rows = rows;
    getAllUsersRequestBody.sortField = sortField;
    getAllUsersRequestBody.sortOrder = sortOrder;
    getAllUsersRequestBody.multiSortMeta = this.multiSortMeta;
    getAllUsersRequestBody.filters = this.filters;
    getAllUsersRequestBody.globalFilter = this.searchTerm;

    this.http.post<GetAllUsersQueryTableResponseModel>(
      'users/getall',
      getAllUsersRequestBody,
      res => {
        this.users = [];

        this.users = res.data.getAllUsersQueryResponse;

        this.totalRecords = res.data.totalCount;

        this.loading = false;
      }
    );
  }

  editRecord(user: GetAllUsersQueryResponseModel) {
    this.router.navigate([
      '/users/' + user.roleNames[0].toLowerCase() + '/',
      user.id
    ]);
  }

  deleteRecord(user: GetAllUsersQueryResponseModel) {
    const deleteUserRequestBody = new DeleteUserByIdCommandModel();

    deleteUserRequestBody.id = user.id;

    this.userFullNameWillBeDeleted = user.fullName;

    this.confirmationService.confirm({
      header: this.confirmationDialogHeader,
      accept: () => {
        this.http.post<string>(
          'users/deletebyid',
          deleteUserRequestBody,
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: `User ${user.fullName} Deleted`,
              life: 3000
            });

            this.onGlobalFilter();
          }
        );
      }
    });
  }

  onGlobalFilter() {
    this.dataLoad({ first: 0, rows: 5, filters: {} });
  }

  dataLoad(event: TableLazyLoadEvent) {
    this.loading = true;

    const skip = event.first || 0;
    const take = event.rows || 10;
    this.rowsPerPage = take;

    const sortFields =
      event.sortField == undefined
        ? ''
        : Array.isArray(event.sortField)
          ? event.sortField[0][0].toUpperCase() + event.sortField[0].slice(1)
          : event.sortField[0].toUpperCase() + event.sortField.slice(1);

    const sortOrders =
      event.sortOrder === undefined
        ? -1
        : event.sortOrder === null
          ? -1
          : event.sortOrder;

    this.filters = event.filters;

    this.getAllUsers(skip, take, sortFields, sortOrders);
  }
}
