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
import { GetDoctorByIdQueryResponseModel } from '../../../../models/doctors/get.doctor.by.id.query.response.model';
import { UpdateDoctorByIdCommandModel } from '../../../../models/doctors/update.doctor.by.id.command.model';
import { ToastModule } from 'primeng/toast';
import { GetAllDepartmentsQueryResponseModel } from '../../../../models/departments/get.all.departments.query.response.model';
import { GetDoctorByIdQueryModel } from '../../../../models/doctors/get.doctor.by.id.query.model';
import { UpdateDoctorFormValidator } from '../../../../validators/update.doctor.form.validator';
import { UpdateDoctorByIdValidationModel } from '../../../../models/doctors/update.doctor.by.id.validation.model';

@Component({
  selector: 'app-update-doctor',
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
  templateUrl: './update-doctor.component.html',
  styleUrl: './update-doctor.component.css',
  providers: [MessageService]
})
export class UpdateDoctorComponent implements OnInit {
  doctor: GetDoctorByIdQueryResponseModel =
    new GetDoctorByIdQueryResponseModel();

  doctorRequestModel: UpdateDoctorByIdCommandModel =
    new UpdateDoctorByIdCommandModel();

  doctorValidationControl: any;

  doctorFormModel: UpdateDoctorByIdValidationModel =
    new UpdateDoctorByIdValidationModel();

  departments: GetAllDepartmentsQueryResponseModel[] = [];
  selectedDepartment: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  formValidator: UpdateDoctorFormValidator = new UpdateDoctorFormValidator();

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'User' },
      { label: 'Doctor' },
      { label: 'Update Doctor' }
    ];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    const id = this.route.snapshot.paramMap.get('id');

    this.getDoctorById(Number(id!));
  }

  getAllDepartments() {
    this.http.post<GetAllDepartmentsQueryResponseModel[]>(
      'departments/getall',
      {},
      res => {
        this.departments = res.data;

        this.doctorFormModel.department = this.departments.filter(
          x => x.id == this.doctor.departmentId
        )[0];
      }
    );
  }

  getDoctorById(id: number) {
    const getDoctorByIdQueryModel = new GetDoctorByIdQueryModel();

    getDoctorByIdQueryModel.id = id;

    this.http.post<GetDoctorByIdQueryResponseModel>(
      'doctors/getbyid',
      getDoctorByIdQueryModel,
      res => {
        this.doctor = new GetDoctorByIdQueryResponseModel();

        this.doctor = res.data;

        this.doctorFormModel.firstName = this.doctor.firstName;
        this.doctorFormModel.lastName = this.doctor.lastName;
        this.doctorFormModel.email = this.doctor.email;
        this.doctorFormModel.userName = this.doctor.userName;
        this.doctorFormModel.phoneNumber = this.doctor.phoneNumber;

        this.getAllDepartments();
      }
    );
  }

  updateUser() {
    this.doctorRequestModel = new UpdateDoctorByIdCommandModel();

    const id = this.route.snapshot.paramMap.get('id');

    this.doctorRequestModel.id = Number(id);
    this.doctorRequestModel.firstName = this.doctorFormModel.firstName;
    this.doctorRequestModel.lastName = this.doctorFormModel.lastName;
    this.doctorRequestModel.email = this.doctorFormModel.email;
    this.doctorRequestModel.userName = this.doctorFormModel.userName;
    this.doctorRequestModel.phoneNumber = this.doctorFormModel.phoneNumber;
    this.doctorRequestModel.departmentId = this.doctorFormModel.department.id;

    if (!(Object.keys(this.doctorValidationControl).length > 0)) {
      this.http.post('doctors/updatebyid', this.doctorRequestModel, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });

        this.doctorRequestModel = new UpdateDoctorByIdCommandModel();
      });
    }
  }

  onSubmit() {
    this.doctorValidationControl = this.formValidator.validate(
      this.doctorFormModel
    );

    this.updateUser();
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
