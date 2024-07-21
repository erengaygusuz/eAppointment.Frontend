import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { AdvancedTableComponent } from '../../../components/advanced-table/advanced-table.component';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';
import { GetAllUsersQueryResponseModel } from '../../../models/users/get.all.users.query.response.model';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { DeleteUserByIdCommandModel } from '../../../models/users/delete.user.by.id.command.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdvancedTableColumnInfoModel } from '../../../models/others/advanced.table.column.info.model';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    this.getAllUsers();

    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };
  }

  getAllUsers() {
    this.http.post<GetAllUsersQueryResponseModel[]>('users/getall', {}, res => {
      this.users = [];

      this.users = res.data;
    });
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

            this.getAllUsers();
          }
        );
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    const incomingData = event.target as HTMLInputElement;

    table.filterGlobal(incomingData.value, 'contains');
  }
}
