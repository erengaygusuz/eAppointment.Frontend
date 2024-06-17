import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { UserModel } from '../../models/user.model';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { TableColumnInfoModel } from '../../models/table.column.info.model';
import { UserDto } from '../../dtos/user.dto';
import { Mapper } from '@dynamic-mapper/angular';
import { UserMappingProfile } from '../../mapping/user.mapping.profile';
import { RoleModel } from '../../models/role.model';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { AdvancedTableComponent } from '../../components/advanced-table/advanced-table.component';
import { UserDialogComponent } from './partials/user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [PageHeaderComponent, AdvancedTableComponent, UserDialogComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [MessageService, ConfirmationService],
})
export class UsersComponent implements OnInit {
  users: UserDto[] = [];

  userRoleDropdownItems: RoleModel[] = [];

  userModel = new UserModel();

  userDialogVisibility: boolean = false;

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  tableColumnInfos: TableColumnInfoModel[] = [
    {
      columnName: 'Full Name',
      columnFieldName: 'fullName',
    },
    {
      columnName: 'User Name',
      columnFieldName: 'username',
    },
    {
      columnName: 'Email',
      columnFieldName: 'email',
    },
    {
      columnName: 'Role Names',
      columnFieldName: 'roles',
    },
  ];

  globalFilterFieldsData: string[] = [
    'fullName',
    'username',
    'email',
    'roleNames',
  ];

  tableName: string = 'usersTable';

  tableSummaryInfo: string = '';

  tableSearchBoxPlaceHolder: string = 'Search User';

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private readonly mapper: Mapper,
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.getAllRoles();

    this.items = [{ label: 'Users' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  getAll() {
    this.http.post<UserModel[]>('users/getall', {}, (res) => {
      this.users = [];

      res.data.forEach((user: UserModel) => {
        const userDto = this.mapper.map(UserMappingProfile.DomainToDto, user);

        this.users.push(userDto);
      });

      this.tableSummaryInfo = `In total there are ${this.users ? this.users.length : 0} users.`;
    });
  }

  getAllRoles() {
    this.http.post<RoleModel[]>('users/getallroles', {}, (res) => {
      this.userRoleDropdownItems = res.data;
    });
  }

  addRecord() {
    this.userModel = new UserModel();
    this.userDialogVisibility = true;
  }

  editRecord(user: UserDto) {
    const userFromUserDto = this.mapper.map(
      UserMappingProfile.DtoToDomain,
      user,
    );

    this.userModel = { ...userFromUserDto };

    this.userDialogVisibility = true;
  }

  saveUser(form: FormGroup) {
    if (form.valid) {
      let url = '';

      if (this.userModel.id == '') {
        url = 'users/create';
      } else {
        url = 'users/update';
      }

      this.http.post(url, this.userModel, (res) => {
        console.log(res);

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000,
        });

        this.getAll();

        this.userDialogVisibility = false;
        this.userModel = new UserModel();
      });
    }
  }

  deleteRecord(user: UserDto) {
    const userFromUserDto = this.mapper.map(
      UserMappingProfile.DtoToDomain,
      user,
    );

    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + userFromUserDto.fullName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.post<string>(
          'users/deletebyid',
          { id: userFromUserDto.id },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: `User ${userFromUserDto.fullName} Deleted`,
              life: 3000,
            });

            this.getAll();
          },
        );
      },
    });
  }

  changeVisibility(visibility: boolean) {
    this.userDialogVisibility = visibility;
  }

  onGlobalFilter(table: Table, event: Event) {
    const incomingData = event.target as HTMLInputElement;

    table.filterGlobal(incomingData.value, 'contains');
  }
}
