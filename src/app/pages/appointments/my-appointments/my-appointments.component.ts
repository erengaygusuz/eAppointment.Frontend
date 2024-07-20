import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GetAllAppointmentsByPatientIdQueryResponseModel } from '../../../models/appointments/get.all.appointments.by.patient.id.query.response.model';
import { HttpService } from '../../../services/http.service';
import { SimpleTableComponent } from '../../../components/simple-table/simple-table.component';
import { AuthService } from '../../../services/auth.service';
import { GetAllAppointmentsByPatientIdQueryModel } from '../../../models/appointments/get.all.appointments.by.patient.id.query.model';
import { KeyValuePair } from '../../../models/others/key.value.pair.model';
import { EditTableComponent } from '../../../components/edit-table/edit-table.component';
import { AppointmentStatus } from '../../../enums/AppointmentStatus';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [PageHeaderComponent, SimpleTableComponent, EditTableComponent],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css'
})
export class MyAppointmentsComponent implements OnInit {
  appointments: GetAllAppointmentsByPatientIdQueryResponseModel[] = [];

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  columns: any[] = [];

  severityList: KeyValuePair[] = [];

  globalFilterFieldsData: string[] = [
    'departmentName',
    'doctorName',
    'startDate',
    'endDate',
    'status'
  ];

  tableName: string = 'appointmentsTable';

  appointmentStatusList = AppointmentStatus.values<AppointmentStatus>();

  constructor(
    private http: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllApointmentsByPatientId();

    this.items = [{ label: 'Appointment' }, { label: 'My Appointments' }];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    this.columns = [
      { field: 'departmentName', header: 'Department Name', isSeverity: false },
      { field: 'doctorName', header: 'Doctor Name', isSeverity: false },
      { field: 'startDate', header: 'Start Date', isSeverity: false },
      { field: 'endDate', header: 'End Date', isSeverity: false },
      { field: 'status', header: 'Status', isSeverity: true }
    ];

    this.severityList = this.appointmentStatusList?.map((element, index) => {
      return {
        ...this.severityList,
        key: this.appointmentStatusList[index].name(),
        value: this.appointmentStatusList[index].getColor()
      };
    });
  }

  getAllApointmentsByPatientId() {
    const patientId = Number(this.authService.tokenDecode.patientId);

    const getAllAppointmentsByPatientIdQueryModel =
      new GetAllAppointmentsByPatientIdQueryModel();

    getAllAppointmentsByPatientIdQueryModel.patientId = patientId;

    this.http.post<GetAllAppointmentsByPatientIdQueryResponseModel[]>(
      'appointments/getallbypatientid',
      getAllAppointmentsByPatientIdQueryModel,
      res => {
        this.appointments = [];

        this.appointments = res.data;
      }
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    const incomingData = event.target as HTMLInputElement;

    table.filterGlobal(incomingData.value, 'contains');
  }
}
