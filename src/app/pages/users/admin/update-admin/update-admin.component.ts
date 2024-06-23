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
import { MenuItem, MessageService } from 'primeng/api';
import { HttpService } from '../../../../services/http.service';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GetAdminByIdQueryResponseModel } from '../../../../models/admins/get.admin.by.id.query.response.model';
import { UpdateAdminByIdCommandModel } from '../../../../models/admins/update.admin.by.id.command.model';
import { ToastModule } from 'primeng/toast';

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
    InputMaskModule,
    RouterModule,
    ToastModule
  ],
  templateUrl: './update-admin.component.html',
  styleUrl: './update-admin.component.css',
  providers: [MessageService]
})
export class UpdateAdminComponent implements OnInit {
  admin: GetAdminByIdQueryResponseModel = new GetAdminByIdQueryResponseModel();

  updateAdmin: UpdateAdminByIdCommandModel = new UpdateAdminByIdCommandModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  adminForm: FormGroup;

  isFormSubmitted: boolean = false;

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService
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
    this.http.post<GetAdminByIdQueryResponseModel>(
      'admins/getbyid',
      { id: id },
      res => {
        this.admin = new GetAdminByIdQueryResponseModel();

        this.admin = res.data;
      }
    );
  }

  updateUser() {
    if (this.adminForm.valid) {
      this.updateAdmin = new UpdateAdminByIdCommandModel();

      const id = this.route.snapshot.paramMap.get('id');

      this.updateAdmin.id = Number(id);
      this.updateAdmin.firstName = this.admin.firstName;
      this.updateAdmin.lastName = this.admin.lastName;
      this.updateAdmin.email = this.admin.email;
      this.updateAdmin.userName = this.admin.userName;
      this.updateAdmin.phoneNumber = this.admin.phoneNumber;

      this.http.post('admins/updatebyid', this.updateAdmin, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });

        this.updateAdmin = new UpdateAdminByIdCommandModel();
      });
    }
  }

  onSubmit() {
    this.isFormSubmitted = true;

    this.updateUser();
  }
}
