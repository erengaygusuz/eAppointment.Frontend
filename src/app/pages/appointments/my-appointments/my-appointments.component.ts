import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GetAllAppointmentsByPatientIdQueryResponseModel } from '../../../models/appointments/get.all.appointments.by.patient.id.query.response.model';
import { HttpService } from '../../../services/http.service';
import { SimpleTableComponent } from '../../../components/simple-table/simple-table.component';
import { GetAllAppointmentsByPatientIdQueryModel } from '../../../models/appointments/get.all.appointments.by.patient.id.query.model';
import { Severity } from '../../../models/others/severity.model';
import { EditTableComponent } from '../../../components/edit-table/edit-table.component';
import { AppointmentStatus } from '../../../enums/AppointmentStatus';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../../../services/language.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [
    PageHeaderComponent,
    SimpleTableComponent,
    EditTableComponent,
    TranslateModule
  ],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css'
})
export class MyAppointmentsComponent implements OnInit, OnDestroy {
  appointments: GetAllAppointmentsByPatientIdQueryResponseModel[] = [];

  pageTitle: string = '';

  items: MenuItem[] = [{ label: '' }, { label: '' }];
  home: MenuItem | undefined;

  columns: any[] = [];

  severityList: Severity[] = [];

  globalFilterFieldsData: string[] = [
    'departmentName',
    'doctorName',
    'startDate',
    'endDate',
    'status'
  ];

  tableName: string = 'appointmentsTable';

  appointmentStatusList = AppointmentStatus.values<AppointmentStatus>();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  constructor(
    private http: HttpService,
    private tokenService: TokenService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    this.getAllApointmentsByPatientId();

    this.columns = [
      { field: 'departmentName', header: '', isSeverity: false },
      { field: 'doctorName', header: '', isSeverity: false },
      { field: 'startDate', header: '', isSeverity: false },
      { field: 'endDate', header: '', isSeverity: false },
      { field: 'status', header: '', isSeverity: true }
    ];

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData(
          'Pages.MyAppointments',
          'Enums.AppointmentStatus'
        );
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTranslationData(...keys: string[]) {
    this.translate.get(keys).subscribe(data => {
      this.items = this.items?.map((element, index) => {
        return {
          ...element,
          label: data['Pages.MyAppointments'].BreadcrumbItems[index].Name
        };
      });
      this.pageTitle = data['Pages.MyAppointments'].Title;

      this.columns = this.columns?.map((element, index) => {
        return {
          ...element,
          header:
            data['Pages.MyAppointments'].MyAppointmentsTable.ColumnHeaders[
              index
            ].Name
        };
      });

      this.severityList = this.appointmentStatusList?.map((element, index) => {
        return {
          ...this.severityList,
          value: this.appointmentStatusList[index].value,
          color: this.appointmentStatusList[index].getColor(),
          translatedText:
            data['Enums.AppointmentStatus'][
              this.appointmentStatusList[index].value
            ]
        };
      });
    });
  }

  getAllApointmentsByPatientId() {
    const patientId = Number(this.tokenService.getPatientId());

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
