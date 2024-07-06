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
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { CreateDoctorCommandModel } from '../../../../models/doctors/create.doctor.command.model';
import { GetAllDepartmentsQueryResponseModel } from '../../../../models/departments/get.all.departments.query.response.model';
import { CreateDoctorValidationModel } from '../../../../models/doctors/create.doctor.validation.model';
import { CreateDoctorFormValidator } from '../../../../validators/create.doctor.form.validator';

@Component({
  selector: 'app-create-doctor',
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
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.css',
  providers: [MessageService]
})
export class CreateDoctorComponent implements OnInit {
  doctorRequestModel: CreateDoctorCommandModel = new CreateDoctorCommandModel();

  doctorValidationControl: any;

  doctorFormModel: CreateDoctorValidationModel =
    new CreateDoctorValidationModel();

  departments: GetAllDepartmentsQueryResponseModel[] = [];
  selectedDepartment: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  formValidator: CreateDoctorFormValidator = new CreateDoctorFormValidator();

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'User' },
      { label: 'Doctor' },
      { label: 'Create Doctor' }
    ];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    this.getAllDepartments();
  }

  getAllDepartments() {
    this.http.post<GetAllDepartmentsQueryResponseModel[]>(
      'departments/getall',
      {},
      res => {
        this.departments = res.data;
      }
    );
  }

  createUser() {
    this.doctorRequestModel.departmentId = this.selectedDepartment.id;

    this.doctorRequestModel.firstName = this.doctorFormModel.firstName;
    this.doctorRequestModel.lastName = this.doctorFormModel.lastName;
    this.doctorRequestModel.userName = this.doctorFormModel.userName;
    this.doctorRequestModel.phoneNumber = this.doctorFormModel.phoneNumber;
    this.doctorRequestModel.email = this.doctorFormModel.email;
    this.doctorRequestModel.password = this.doctorFormModel.password;
    this.doctorRequestModel.departmentId = this.doctorFormModel.department.id;

    if (!(Object.keys(this.doctorValidationControl).length > 0)) {
      this.http.post('doctors/create', this.doctorRequestModel, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });
        this.doctorRequestModel = new CreateDoctorCommandModel();
        this.doctorFormModel = new CreateDoctorValidationModel();
        this.doctorValidationControl = {};
      });
    }
  }

  onSubmit() {
    const validationResult = this.formValidator.validate(this.doctorFormModel);

    this.doctorValidationControl = validationResult;

    this.createUser();
  }

  checkForValidation(propName: string) {
    const validationResult = this.formValidator.validate(this.doctorFormModel);

    const convertedValidationResult = Object.fromEntries(
      Object.entries(validationResult)
        .filter(([key]) => key == propName)
        .map(obj => obj)
    );

    this.doctorValidationControl = convertedValidationResult;
  }
}
