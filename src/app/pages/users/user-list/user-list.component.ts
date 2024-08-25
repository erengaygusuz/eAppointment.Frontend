import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { AdvancedTableComponent } from '../../../components/advanced-table/advanced-table.component';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
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

  globalFilterFieldsData: string[] = [
    'fullName',
    'username',
    'email',
    'roleNames'
  ];

  tableName: string = 'usersTable';

  confirmationDialogMessage: string = '';
  confirmationDialogHeader: string = '';
  userFullNameWillBeDeleted: string = '';

  totalRecords: number = 0;
  loading: boolean = true;
  searchTerm: string = '';
  rowsPerPage: number = 5;

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
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'email',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'userName',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'roleNames',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: '',
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
    page: number,
    pageSize: number,
    sortFields: string,
    sortOrders: string
  ) {
    const getAllUsersRequestBody = new GetAllUsersQueryModel();

    getAllUsersRequestBody.skip = page;
    getAllUsersRequestBody.take = pageSize;
    getAllUsersRequestBody.sortFields = sortFields;
    getAllUsersRequestBody.sortOrders = sortOrders;
    getAllUsersRequestBody.searchTerm = this.searchTerm;

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
    this.dataLoad({ first: 0, rows: 10 });
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

    const sortOrders = event.sortOrder === 1 ? 'asc' : 'desc';

    this.getAllUsers(skip, take, sortFields, sortOrders);
  }
}
