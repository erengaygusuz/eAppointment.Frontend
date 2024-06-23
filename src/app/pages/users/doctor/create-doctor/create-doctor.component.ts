import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
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
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { CreateDoctorCommandModel } from '../../../../models/doctors/create.doctor.command.model';
import { GetAllDepartmentsQueryResponseModel } from '../../../../models/departments/get.all.departments.query.response.model';
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
  doctor: CreateDoctorCommandModel = new CreateDoctorCommandModel();

  departments: GetAllDepartmentsQueryResponseModel[] = [];
  selectedDepartment: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  doctorForm: FormGroup;

  isFormSubmitted: boolean = false;

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService
  ) {
    this.doctorForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordAgain: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      department: new FormControl(0, [Validators.pattern('[^0]+')])
    });
  }

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
    this.doctor.departmentId = this.selectedDepartment.id;

    if (this.doctorForm.valid) {
      this.http.post('doctors/create', this.doctor, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });
        this.doctor = new CreateDoctorCommandModel();
      });
    }
  }

  onSubmit() {
    this.isFormSubmitted = true;

    this.createUser();
  }
}
