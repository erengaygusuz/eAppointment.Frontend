import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { GetAllAppointmentsByPatientIdQueryResponseModel } from '../../../models/appointments/get.all.appointments.by.patient.id.query.response.model';
import { HttpService } from '../../../services/http.service';
import { SimpleTableComponent } from '../../../components/simple-table/simple-table.component';
import { AuthService } from '../../../services/auth.service';
import { KeyValuePair } from '../../../models/others/key.value.pair.model';
import { EditTableComponent } from '../../../components/edit-table/edit-table.component';
import { UpdateAppointmentByIdCommandModel } from '../../../models/appointments/update.appointment.by.id.command.model';
import { DatePipe } from '@angular/common';
import { UpdateAppointmentDialogComponent } from '../partials/update-appointment-dialog/update-appointment-dialog.component';
import { GetAllAppointmentsByDoctorIdAndByStatusQueryModel } from '../../../models/appointments/get.all.appointments.by.doctor.id.and.by.status.query.model';
import { GetAllAppointmentsByDoctorIdAndByStatusQueryResponseModel } from '../../../models/appointments/get.all.appointments.by.doctor.id.and.by.status.query.response.model';
import { UpdateAppointmentByIdValidationModel } from '../../../models/appointments/update.appointment.by.id.validation.model';
import { AppointmentStatus } from '../../../enums/AppointmentStatus';
import { UpdateAppointmentFormValidator } from '../../../validators/update.appointment.form.validator';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    SimpleTableComponent,
    EditTableComponent,
    UpdateAppointmentDialogComponent
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
  providers: [DatePipe, MessageService]
})
export class AppointmentListComponent implements OnInit {
  appointments: GetAllAppointmentsByPatientIdQueryResponseModel[] = [];

  updateAppointmentRequestModel = new UpdateAppointmentByIdCommandModel();

  updateAppointmentFormModel = new UpdateAppointmentByIdValidationModel();

  validationControl: any;

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  columns: any[] = [];

  severityList: KeyValuePair[] = [];

  globalFilterFieldsData: string[] = [
    'fullName',
    'startDate',
    'endDate',
    'status'
  ];

  tableName: string = 'appointmentsTable';

  updateAppointmentDialogVisibility: boolean = false;

  appointmentStatusList = AppointmentStatus.values<AppointmentStatus>();

  formValidator: UpdateAppointmentFormValidator =
    new UpdateAppointmentFormValidator();

  constructor(
    private http: HttpService,
    private authService: AuthService,
    private date: DatePipe,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllAppointmentsByDoctorId();

    this.items = [{ label: 'Appointment' }, { label: 'My Appointments' }];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    this.columns = [
      {
        field: 'fullName',
        header: 'Full Name',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'startDate',
        header: 'Start Date',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'endDate',
        header: 'End Date',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'status',
        header: 'Status',
        isSeverity: true,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: '',
        header: 'Operations',
        isSeverity: false,
        isOperationColumn: true,
        isFilterableAndSortable: false
      }
    ];

    this.severityList = this.appointmentStatusList?.map((element, index) => {
      return {
        ...this.severityList,
        key: this.appointmentStatusList[index].name(),
        value: this.appointmentStatusList[index].getColor()
      };
    });
  }

  getAllAppointmentsByDoctorId() {
    const doctorId = Number(this.authService.tokenDecode.doctorId);

    const getAllAppointmentsByDoctorIdAndByStatusQueryModel =
      new GetAllAppointmentsByDoctorIdAndByStatusQueryModel();

    getAllAppointmentsByDoctorIdAndByStatusQueryModel.status =
      AppointmentStatus.NotCompleted.getConvertedValue();
    getAllAppointmentsByDoctorIdAndByStatusQueryModel.doctorId = doctorId;

    this.http.post<GetAllAppointmentsByDoctorIdAndByStatusQueryResponseModel[]>(
      'appointments/getallbydoctorid',
      getAllAppointmentsByDoctorIdAndByStatusQueryModel,
      res => {
        this.appointments = [];

        this.appointments = res.data;
      }
    );
  }

  editRecord(tableData: any) {
    this.updateAppointmentFormModel =
      new UpdateAppointmentByIdValidationModel();

    this.updateAppointmentFormModel.id = tableData.id;
    this.updateAppointmentFormModel.fullName = tableData.fullName;
    this.updateAppointmentFormModel.startDate = tableData.startDate;
    this.updateAppointmentFormModel.endDate = tableData.endDate;
    this.updateAppointmentFormModel.status = AppointmentStatus.valueOf(
      (tableData.status as string).replace(' ', '')
    );

    this.updateAppointmentDialogVisibility = true;
  }

  onSubmit() {
    this.validationControl = this.formValidator.validate(
      this.updateAppointmentFormModel
    );

    this.saveAppointment();
  }

  saveAppointment() {
    this.updateAppointmentRequestModel =
      new UpdateAppointmentByIdCommandModel();

    this.updateAppointmentRequestModel.id = this.updateAppointmentFormModel.id;
    this.updateAppointmentRequestModel.startDate =
      this.updateAppointmentFormModel.startDate;
    this.updateAppointmentRequestModel.endDate =
      this.updateAppointmentFormModel.endDate;
    this.updateAppointmentRequestModel.status =
      this.updateAppointmentFormModel.status.getConvertedValue();

    if (!(Object.keys(this.validationControl).length > 0)) {
      this.http.post(
        'appointments/updatestatusbyid',
        this.updateAppointmentRequestModel,
        res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.data,
            life: 3000
          });

          this.updateAppointmentDialogVisibility = false;
          this.updateAppointmentRequestModel =
            new UpdateAppointmentByIdCommandModel();

          this.validationControl = {};

          this.getAllAppointmentsByDoctorId();
        }
      );
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    const incomingData = event.target as HTMLInputElement;

    table.filterGlobal(incomingData.value, 'contains');
  }

  changeVisibility(visibility: boolean) {
    this.updateAppointmentDialogVisibility = visibility;
  }
}
