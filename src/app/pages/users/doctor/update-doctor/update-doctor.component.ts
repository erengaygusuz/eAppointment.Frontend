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
import { GetDoctorByIdQueryResponseModel } from '../../../../models/doctors/get.doctor.by.id.query.response.model';
import { UpdateDoctorByIdCommandModel } from '../../../../models/doctors/update.doctor.by.id.command.model';
import { ToastModule } from 'primeng/toast';
import { GetAllDepartmentsQueryResponseModel } from '../../../../models/departments/get.all.departments.query.response.model';

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
    RouterModule,
    ToastModule
  ],
  templateUrl: './update-doctor.component.html',
  styleUrl: './update-doctor.component.css',
  providers: [MessageService]
})
export class UpdateDoctorComponent implements OnInit {
  doctor: GetDoctorByIdQueryResponseModel = new GetDoctorByIdQueryResponseModel();

  updateDoctor: UpdateDoctorByIdCommandModel =
    new UpdateDoctorByIdCommandModel();

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
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.doctorForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      department: new FormControl(0, [Validators.pattern('[^0]+')])
    });
  }

  ngOnInit(): void {
    this.items = [
      { label: 'User' },
      { label: 'Doctor' },
      { label: 'Update Doctor' }
    ];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    const id = this.route.snapshot.paramMap.get('id');

    this.getDoctorById(id!);
  }

  getAllDepartments(doctor: GetDoctorByIdQueryResponseModel) {
    this.http.post<GetAllDepartmentsQueryResponseModel[]>(
      'departments/getall',
      {},
      res => {
        this.departments = res.data;

        this.selectedDepartment = res.data.filter(
          (x: GetAllDepartmentsQueryResponseModel) =>
            x.id == doctor.departmentId
        )[0];
      }
    );
  }

  getDoctorById(id: string) {
    this.http.post<GetDoctorByIdQueryResponseModel>(
      'doctors/getbyid',
      { id: id },
      res => {
        this.doctor = new GetDoctorByIdQueryResponseModel();

        console.log(res.data);

        this.doctor = res.data;

        this.getAllDepartments(this.doctor);
      }
    );
  }

  updateUser() {
    if (this.doctorForm.valid) {
      this.updateDoctor = new UpdateDoctorByIdCommandModel();

      const id = this.route.snapshot.paramMap.get('id');

      this.updateDoctor.id = Number(id);
      this.updateDoctor.firstName = this.doctor.firstName;
      this.updateDoctor.lastName = this.doctor.lastName;
      this.updateDoctor.email = this.doctor.email;
      this.updateDoctor.userName = this.doctor.userName;
      this.updateDoctor.phoneNumber = this.doctor.phoneNumber;

      this.http.post('doctors/updatebyid', this.updateDoctor, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });

        this.updateDoctor = new UpdateDoctorByIdCommandModel();
      });
    }
  }

  onSubmit() {
    this.isFormSubmitted = true;

    this.updateUser();
  }
}
