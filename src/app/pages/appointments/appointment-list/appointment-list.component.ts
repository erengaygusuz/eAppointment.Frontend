import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { GetAllAppointmentsByPatientIdQueryResponseModel } from '../../../models/appointments/get.all.appointments.by.patient.id.query.response.model';
import { HttpService } from '../../../services/http.service';
import { SimpleTableComponent } from '../../../components/simple-table/simple-table.component';
import { Severity } from '../../../models/others/severity.model';
import { EditTableComponent } from '../../../components/edit-table/edit-table.component';
import { UpdateAppointmentByIdCommandModel } from '../../../models/appointments/update.appointment.by.id.command.model';
import { DatePipe } from '@angular/common';
import { UpdateAppointmentDialogComponent } from '../partials/update-appointment-dialog/update-appointment-dialog.component';
import { GetAllAppointmentsByDoctorIdAndByStatusQueryModel } from '../../../models/appointments/get.all.appointments.by.doctor.id.and.by.status.query.model';
import { GetAllAppointmentsByDoctorIdAndByStatusQueryResponseModel } from '../../../models/appointments/get.all.appointments.by.doctor.id.and.by.status.query.response.model';
import { UpdateAppointmentByIdValidationModel } from '../../../models/appointments/update.appointment.by.id.validation.model';
import { AppointmentStatus } from '../../../enums/AppointmentStatus';
import { UpdateAppointmentFormValidator } from '../../../validators/update.appointment.form.validator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../../../services/language.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    SimpleTableComponent,
    EditTableComponent,
    UpdateAppointmentDialogComponent,
    TranslateModule
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
  providers: [DatePipe, MessageService]
})
export class AppointmentListComponent implements OnInit, OnDestroy {
  appointments: GetAllAppointmentsByPatientIdQueryResponseModel[] = [];

  pageTitle: string = '';

  updateAppointmentRequestModel = new UpdateAppointmentByIdCommandModel();

  updateAppointmentFormModel = new UpdateAppointmentByIdValidationModel();

  validationControl: any;

  items: MenuItem[] = [{ label: '' }];
  home: MenuItem | undefined;

  columns: any[] = [];

  severityList: Severity[] = [];

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

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  toastSuccessSummary: string = '';

  constructor(
    private http: HttpService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    this.getAllAppointmentsByDoctorId();

    this.columns = [
      {
        field: 'fullName',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'startDate',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'endDate',
        header: '',
        isSeverity: false,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: 'status',
        header: '',
        isSeverity: true,
        isOperationColumn: false,
        isFilterableAndSortable: true
      },
      {
        field: '',
        header: '',
        isSeverity: false,
        isOperationColumn: true,
        isFilterableAndSortable: false
      }
    ];

    this.formValidator.getTranslationData(this.translate);

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData(
          'Pages.Appointments',
          'Enums.AppointmentStatus',
          'Components.Toast'
        );

        this.formValidator.getTranslationData(this.translate);

        this.validationControl = {};
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
          label: data['Pages.Appointments'].BreadcrumbItems[index].Name
        };
      });

      this.pageTitle = data['Pages.Appointments'].Title;

      this.columns = this.columns?.map((element, index) => {
        return {
          ...element,
          header:
            data['Pages.Appointments'].AppointmentsTable.ColumnHeaders[index]
              .Name
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

      this.toastSuccessSummary = data['Components.Toast'].Success.Summary;
    });
  }

  getAllAppointmentsByDoctorId() {
    const doctorId = this.tokenService.getDoctorId();

    const getAllAppointmentsByDoctorIdAndByStatusQueryModel =
      new GetAllAppointmentsByDoctorIdAndByStatusQueryModel();

    getAllAppointmentsByDoctorIdAndByStatusQueryModel.status =
      AppointmentStatus.NotCompleted.getConvertedValue();
    getAllAppointmentsByDoctorIdAndByStatusQueryModel.doctorId = doctorId;

    this.http.get<GetAllAppointmentsByDoctorIdAndByStatusQueryResponseModel[]>(
      'appointments/getallbydoctorid?doctorId=' +
        getAllAppointmentsByDoctorIdAndByStatusQueryModel.doctorId,
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
      this.http.put(
        'appointments/updatestatusbyid',
        this.updateAppointmentRequestModel,
        res => {
          this.messageService.add({
            severity: 'success',
            summary: this.toastSuccessSummary,
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
