import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { AdvancedTableComponent } from '../../../components/advanced-table/advanced-table.component';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';
import { GetAllUsersQueryResponseModel } from '../../../models/users/get.all.users.query.response.model';
import { TableColumnInfoModel } from '../../../models/others/table.column.info.model';
import { Table } from 'primeng/table';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [PageHeaderComponent, AdvancedTableComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  providers: [MessageService, ConfirmationService]
})
export class UserListComponent implements OnInit {
  users: GetAllUsersQueryResponseModel[] = [];

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  tableColumnInfos: TableColumnInfoModel[] = [
    {
      columnName: 'Full Name',
      columnFieldName: 'fullName'
    },
    {
      columnName: 'User Name',
      columnFieldName: 'username'
    },
    {
      columnName: 'Email',
      columnFieldName: 'email'
    },
    {
      columnName: 'Role Names',
      columnFieldName: 'roles'
    }
  ];

  globalFilterFieldsData: string[] = [
    'fullName',
    'username',
    'email',
    'roleNames'
  ];

  tableName: string = 'usersTable';

  tableSummaryInfo: string = '';

  tableSearchBoxPlaceHolder: string = 'Search User';

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();

    this.items = [{ label: 'User' }, { label: 'All Users' }];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };
  }

  getAllUsers() {
    this.http.post<GetAllUsersQueryResponseModel[]>('users/getall', {}, res => {
      this.users = [];

      this.users = res.data;

      console.log(res.data);

      this.tableSummaryInfo = `In total there are ${this.users ? this.users.length : 0} users.`;
    });
  }

  addRecord() {
    // this.userModel = new UserModel();
    // this.userDialogVisibility = true;
  }

  editRecord(user: GetAllUsersQueryResponseModel) {
    this.router.navigate([
      '/users/' + user.roleNames[0].toLowerCase() + '/',
      user.id
    ]);
  }

  deleteRecord(user: GetAllUsersQueryResponseModel) {
    // this.confirmationService.confirm({
    //   message:
    //     'Are you sure you want to delete ' + userFromUserDto.fullName + '?',
    //   header: 'Confirm',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.http.post<string>(
    //       'users/deletebyid',
    //       { id: userFromUserDto.id },
    //       () => {
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Successful',
    //           detail: `User ${userFromUserDto.fullName} Deleted`,
    //           life: 3000
    //         });
    //         this.getAll();
    //       }
    //     );
    //   }
    // });
  }

  saveUser(form: FormGroup) {
    // if (form.valid) {
    //   let url = '';
    //   if (this.userModel.id == '') {
    //     url = 'users/create';
    //   } else {
    //     url = 'users/update';
    //   }
    //   this.http.post(url, this.userModel, res => {
    //     console.log(res);
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: res.data,
    //       life: 3000
    //     });
    //     this.getAll();
    //     this.userModel = new UserModel();
    //   });
    // }
  }

  onGlobalFilter(table: Table, event: Event) {
    const incomingData = event.target as HTMLInputElement;

    table.filterGlobal(incomingData.value, 'contains');
  }
}
