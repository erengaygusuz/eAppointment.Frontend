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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GetAdminByIdQueryResponseModel } from '../../../../models/admins/get.admin.by.id.query.response.model';
import { UpdateAdminByIdCommandModel } from '../../../../models/admins/update.admin.by.id.command.model';
import { ToastModule } from 'primeng/toast';
import { GetAdminByIdQueryModel } from '../../../../models/admins/get.admin.by.id.query.model';
import { UpdateAdminByIdValidationModel } from '../../../../models/admins/update.admin.by.id.validation.model';
import { UpdateAdminFormValidator } from '../../../../validators/update.admin.form.validator';
import { AdminMappingProfile } from '../../../../mapping/admin.mapping.profile';
import { Mapper } from '@dynamic-mapper/angular';

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
    FormsModule,
    ToastModule,
    RouterModule
  ],
  templateUrl: './update-admin.component.html',
  styleUrl: './update-admin.component.css',
  providers: [MessageService]
})
export class UpdateAdminComponent implements OnInit {
  admin: GetAdminByIdQueryResponseModel = new GetAdminByIdQueryResponseModel();

  adminRequestModel: UpdateAdminByIdCommandModel =
    new UpdateAdminByIdCommandModel();

  adminValidationControl: any;

  adminFormModel: UpdateAdminByIdValidationModel =
    new UpdateAdminByIdValidationModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  formValidator: UpdateAdminFormValidator = new UpdateAdminFormValidator();

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private readonly mapper: Mapper
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'User' },
      { label: 'Admin' },
      { label: 'Update Admin' }
    ];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    const id = this.route.snapshot.paramMap.get('id');

    this.getAdminById(Number(id!));
  }

  getAdminById(id: number) {
    const getAdminByIdQueryModel = new GetAdminByIdQueryModel();

    getAdminByIdQueryModel.id = id;

    this.http.post<GetAdminByIdQueryResponseModel>(
      'admins/getbyid',
      getAdminByIdQueryModel,
      res => {
        this.admin = new GetAdminByIdQueryResponseModel();

        this.admin = res.data;

        this.adminFormModel = this.mapper.map(
          AdminMappingProfile.GetAdminByIdQueryResponseModelToUpdateAdminByIdValidationModel,
          this.admin
        );
      }
    );
  }

  updateUser() {
    this.adminRequestModel = new UpdateAdminByIdCommandModel();

    const id = this.route.snapshot.paramMap.get('id');

    this.adminRequestModel = this.mapper.map(
      AdminMappingProfile.UpdateAdminByIdValidationModelToUpdateAdminByIdCommandModel,
      this.adminFormModel
    );

    this.adminRequestModel.id = Number(id);

    if (!(Object.keys(this.adminValidationControl).length > 0)) {
      this.http.post('admins/updatebyid', this.adminRequestModel, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });

        this.adminRequestModel = new UpdateAdminByIdCommandModel();
      });
    }
  }

  onSubmit() {
    this.adminValidationControl = this.formValidator.validate(
      this.adminFormModel
    );

    this.updateUser();
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
