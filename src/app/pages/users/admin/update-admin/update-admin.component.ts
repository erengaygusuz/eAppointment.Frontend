import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { MenuItem } from 'primeng/api';
import { GetAllRolesQueryResponseModel } from '../../../../models/roles/get.all.roles.query.response.model';
import { HttpService } from '../../../../services/http.service';
import { AuthService } from '../../../../services/auth.service';
import { CreateAdminCommandModel } from '../../../../models/admins/create.admin.command.model';

@Component({
  selector: 'app-update-admin',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    InputMaskModule
  ],
  templateUrl: './update-admin.component.html',
  styleUrl: './update-admin.component.css'
})
export class UpdateAdminComponent implements OnInit {
  user: CreateAdminCommandModel = new CreateAdminCommandModel();

  userRoles: GetAllRolesQueryResponseModel[] = [];
  selectedUserRole: GetAllRolesQueryResponseModel =
    new GetAllRolesQueryResponseModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  userForm: FormGroup;

  isFormSubmitted: boolean = false;

  constructor(
    private http: HttpService,
    public auth: AuthService
  ) {
    this.userForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      role: new FormControl(1, [])
    });
  }

  ngOnInit(): void {
    this.items = [{ label: 'Users' }];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    this.getAllUserRoles();
  }

  getAllUserRoles() {
    this.http.post<GetAllRolesQueryResponseModel[]>('roles/getall', {}, res => {
      this.userRoles = res.data;

      this.selectedUserRole = res.data[1];
    });
  }

  updateUser() {
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

  onSubmit() {
    this.isFormSubmitted = true;

    this.updateUser();
  }
}
