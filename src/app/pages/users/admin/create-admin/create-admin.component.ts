import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { MenuItem, MessageService } from 'primeng/api';
import { HttpService } from '../../../../services/http.service';
import { AuthService } from '../../../../services/auth.service';
import { CreateAdminCommandModel } from '../../../../models/admins/create.admin.command.model';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { CreateAdminValidationModel } from '../../../../models/admins/create.admin.validation.model';
import { CreateAdminFormValidator } from '../../../../validators/create.admin.form.validator';

@Component({
  selector: 'app-create-admin',
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
    FormsModule,
    ToastModule,
    RouterModule
  ],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
  providers: [MessageService]
})
export class CreateAdminComponent implements OnInit {
  adminRequestModel: CreateAdminCommandModel = new CreateAdminCommandModel();

  adminValidationControl: any;

  adminFormModel: CreateAdminValidationModel = new CreateAdminValidationModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  formValidator: CreateAdminFormValidator = new CreateAdminFormValidator();

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'User' },
      { label: 'Admin' },
      { label: 'Create Admin' }
    ];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };
  }

  createUser() {

    this.adminRequestModel.firstName = this.adminFormModel.firstName;
    this.adminRequestModel.lastName = this.adminFormModel.lastName;
    this.adminRequestModel.userName = this.adminFormModel.userName;
    this.adminRequestModel.phoneNumber = this.adminFormModel.phoneNumber;
    this.adminRequestModel.email = this.adminFormModel.email;
    this.adminRequestModel.password = this.adminFormModel.password;

    if (!(Object.keys(this.adminValidationControl).length > 0)) {
      this.http.post('admins/create', this.adminRequestModel, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });
        this.adminRequestModel = new CreateAdminCommandModel();
        this.adminFormModel = new CreateAdminValidationModel();
        this.adminValidationControl = {};
      });
    }
  }

  onSubmit() {
    const validationResult = this.formValidator.validate(this.adminFormModel);

    this.adminValidationControl = validationResult;

    this.createUser();
  }

  checkForValidation(propName: string) {
    const validationResult = this.formValidator.validate(this.adminFormModel);

    const convertedValidationResult = Object.fromEntries(
      Object.entries(validationResult)
        .filter(([key]) => key == propName)
        .map(obj => obj)
    );

    this.adminValidationControl = convertedValidationResult;
  }
}
