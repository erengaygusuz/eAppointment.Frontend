import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  SelectItem,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { TableColumnInfoModel } from '../../models/others/table.column.info.model';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { AdvancedTableComponent } from '../../components/advanced-table/advanced-table.component';
import { DoctorAddDialogComponent } from './partials/doctor-add-dialog/doctor-add-dialog.component';
import { GetAllDoctorsQueryResponseModel } from '../../models/doctors/get.all.doctors.query.response.model';
import { CreateUserCommandModel } from '../../models/users/create.user.command.model';
import { GetDoctorByIdQueryResponseModel } from '../../models/doctors/get.doctor.by.id.query.response.model';
import { DoctorEditDialogComponent } from './partials/doctor-edit-dialog/doctor-edit-dialog.component';
import { DeleteDoctorByIdCommandModel } from '../../models/doctors/delete.doctor.by.id.command.model';
import { UpdateDoctorCommandModel } from '../../models/doctors/update.doctor.command.model';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [PageHeaderComponent, AdvancedTableComponent, DoctorAddDialogComponent, DoctorEditDialogComponent],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
  providers: [MessageService, ConfirmationService],
})
export class DoctorsComponent implements OnInit {
  doctors: GetAllDoctorsQueryResponseModel[] = [];
  doctor: GetDoctorByIdQueryResponseModel = new GetDoctorByIdQueryResponseModel();

  createUserCommandModel = new CreateUserCommandModel();
  updateDoctorCommandModel = new UpdateDoctorCommandModel();
  deleteDoctorByIdCommandModel = new DeleteDoctorByIdCommandModel();

  doctorAddDialogVisibility: boolean = false;
  doctorEditDialogVisibility: boolean = false;

  departmentDropdownItems: SelectItem[] = [];

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  tableColumnInfos: TableColumnInfoModel[] = [
    {
      columnName: 'Full Name',
      columnFieldName: 'fullName',
    },
    {
      columnName: 'Department Name',
      columnFieldName: 'department.name',
    },
  ];

  globalFilterFieldsData: string[] = ['fullName', 'department.name'];

  tableName: string = 'doctorsTable';

  tableSummaryInfo: string = '';

  tableSearchBoxPlaceHolder: string = 'Search Doctor';

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAll();

    this.items = [{ label: 'Doctors' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  getAll() {
    this.http.post<GetAllDoctorsQueryResponseModel[]>('doctors/getall', {}, (res) => {
      this.doctors = [];

      this.doctors = res.data;

      this.tableSummaryInfo = `In total there are ${this.doctors ? this.doctors.length : 0} doctors.`;
    });
  }

  getById(id: string) {
    this.http.post<GetDoctorByIdQueryResponseModel>('doctors/getbyid', { id: id }, (res) => {
      this.doctor = new GetDoctorByIdQueryResponseModel();

      this.doctor = res.data;
    });
  }

  addRecord() {
    this.createUserCommandModel = new CreateUserCommandModel();
    this.doctorAddDialogVisibility = true;
  }

  editRecord(getAllDoctorsQueryResponseModel: GetAllDoctorsQueryResponseModel) {

    this.getById(getAllDoctorsQueryResponseModel.id);

    this.doctorEditDialogVisibility = true;
  }

  addDoctor(form: FormGroup) {
    if (form.valid) {

      this.http.post('doctors/create', this.createUserCommandModel, (res) => {
        console.log(res);

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000,
        });

        this.getAll();

        this.doctorAddDialogVisibility = false;
        this.createUserCommandModel = new CreateUserCommandModel();
      });
    }
  }

  updateDoctor(form: FormGroup) {
    if (form.valid) {

      this.http.post('doctors/update', this.updateDoctorCommandModel, (res) => {
        console.log(res);

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000,
        });

        this.getAll();

        this.doctorEditDialogVisibility = false;
        this.updateDoctorCommandModel = new UpdateDoctorCommandModel();
      });
    }
  }

  deleteRecord(getAllDoctorsQueryResponseModel: GetAllDoctorsQueryResponseModel) {

    const fullName = getAllDoctorsQueryResponseModel.firstName + " " + getAllDoctorsQueryResponseModel.lastName;

    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + fullName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.post<string>(
          'doctors/deletebyid',
          { id: this.deleteDoctorByIdCommandModel.id },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: `Doctor ${fullName} Deleted`,
              life: 3000,
            });

            this.getAll();
          },
        );
      },
    });
  }

  changeAddDialogVisibility(visibility: boolean) {
    this.doctorAddDialogVisibility = visibility;
  }

  changeEditDialogVisibility(visibility: boolean) {
    this.doctorEditDialogVisibility = visibility;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
