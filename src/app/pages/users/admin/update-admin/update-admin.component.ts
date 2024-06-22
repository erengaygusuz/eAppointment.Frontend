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
import { HttpService } from '../../../../services/http.service';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GetAdminByIdQueryResponse } from '../../../../models/admins/get.admin.by.id.query.response.model';

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
  admin: GetAdminByIdQueryResponse = new GetAdminByIdQueryResponse();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  adminForm: FormGroup;

  isFormSubmitted: boolean = false;

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.adminForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.items = [
      { label: 'User' },
      { label: 'Admin' },
      { label: 'Update Admin' }
    ];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    const id = this.route.snapshot.paramMap.get('id');

    this.getUserById(id!);
  }

  getUserById(id: string) {
    this.http.post<GetAdminByIdQueryResponse>(
      'admins/getbyid',
      { id: id },
      res => {
        this.admin = new GetAdminByIdQueryResponse();

        this.admin = res.data;

        //this.getAllUserRoles(this.user);
      }
    );
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
