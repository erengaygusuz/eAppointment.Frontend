import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import {
  FullCalendarComponent,
  FullCalendarModule
} from '@fullcalendar/angular';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { GetAllDepartmentsQueryResponseModel } from '../../../models/departments/get.all.departments.query.response.model';
import { GetAllDoctorsByDepartmentIdQueryResponseModel } from '../../../models/doctors/get.all.doctors.by.department.id.query.response.model';
import { CreateAppointmentCommandModel } from '../../../models/appointments/create.appointment.command.model';
import { HttpService } from '../../../services/http.service';
import { TopBarService } from '../../../services/topbar.service';
import { GetAllDoctorsByDepartmentIdQueryModel } from '../../../models/doctors/get.all.doctors.by.department.id.query.model';
import { AuthService } from '../../../services/auth.service';
import { GetAllAppointmentsByPatientIdAndByStatusQueryModel } from '../../../models/appointments/get.all.appointments.by.patient.id.and.by.status.query.model';
import { CancelAppointmentByIdCommandModel } from '../../../models/appointments/cancel.appointment.by.id.command.model';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GetAllAppointmentsByPatientIdAndByStatusQueryResponseModel } from '../../../models/appointments/get.all.appointments.by.patient.id.and.by.status.query.response.model';
import { UpdateAppointmentByIdCommandModel } from '../../../models/appointments/update.appointment.by.id.command.model';
import { CreateAppointmentDialogComponent } from '../partials/create-appointment-dialog/create-appointment-dialog.component';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    DropdownModule,
    FullCalendarModule,
    CreateAppointmentDialogComponent,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css',
  providers: [DatePipe, MessageService, ConfirmationService]
})
export class CreateAppointmentComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    allDaySlot: false,
    slotMinTime: '09:00:00',
    slotMaxTime: '18:00:00',
    hiddenDays: [0, 6],
    plugins: [timeGridPlugin, interactionPlugin],
    dateClick: arg => this.handleDateClick(arg),
    eventDrop: arg => this.handleEventDrop(arg),
    eventClick: arg => this.handleEventClick(arg),
    editable: true,
    expandRows: true,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    events: []
  };

  departments: GetAllDepartmentsQueryResponseModel[] = [];
  doctors: GetAllDoctorsByDepartmentIdQueryResponseModel[] = [];

  selectedDepartment: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();

  selectedDoctor: GetAllDoctorsByDepartmentIdQueryResponseModel =
    new GetAllDoctorsByDepartmentIdQueryResponseModel();

  appointments: GetAllAppointmentsByPatientIdAndByStatusQueryResponseModel[] =
    [];

  createAppointmentModel = new CreateAppointmentCommandModel();

  updateAppointmentRequestModel = new UpdateAppointmentByIdCommandModel();

  selectedAppointment =
    new GetAllAppointmentsByPatientIdAndByStatusQueryResponseModel();

  appointmentDialogVisibility: boolean = false;

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  @ViewChild('appointmentCalendar')
  calendarComponent!: FullCalendarComponent;

  selectedEndDateStr: string = '';

  constructor(
    private http: HttpService,
    private date: DatePipe,
    private topbarService: TopBarService,
    private messageService: MessageService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Appointment' }, { label: 'Create Appointment' }];

    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    this.topbarService.subject.subscribe(() => {
      this.updateCalendarSize();
    });

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

  handleDateClick(arg: any) {
    this.addRecord(arg);
  }

  handleEventDrop(arg: any) {
    this.updateAppointmentRequestModel =
      new UpdateAppointmentByIdCommandModel();
    this.updateAppointmentRequestModel.id = arg.event.id;
    this.updateAppointmentRequestModel.startDate =
      this.date.transform(arg.event.startStr, 'dd.MM.yyyy HH:mm') ?? '';
    this.updateAppointmentRequestModel.endDate =
      this.date.transform(arg.event.endStr, 'dd.MM.yyyy HH:mm') ?? '';
    this.updateAppointmentRequestModel.status = 4;

    this.http.post(
      'appointments/updatebyid',
      this.updateAppointmentRequestModel,
      res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });

        this.createAppointmentModel = new CreateAppointmentCommandModel();

        this.getAllAppointmentsByPatientId();
      },
      () => {
        this.getAllAppointmentsByPatientId();
      }
    );
  }

  handleEventClick(arg: any) {
    this.deleteRecord(arg);
  }

  updateCalendarSize() {
    setTimeout(() => {
      this.calendarComponent.getApi().updateSize();
    }, 200);
  }

  addRecord(arg: any) {
    this.createAppointmentModel = new CreateAppointmentCommandModel();
    this.createAppointmentModel.startDate =
      this.date.transform(arg.dateStr, 'dd.MM.yyyy HH:mm') ?? '';
    const endDate: Date = new Date(arg.date);
    endDate.setMinutes(endDate.getMinutes() + 30);
    this.createAppointmentModel.endDate =
      this.date.transform(endDate, 'dd.MM.yyyy HH:mm') ?? '';
    this.createAppointmentModel.doctorId = this.selectedDoctor.id;
    this.createAppointmentModel.patientId = Number(
      this.authService.tokenDecode.patientId
    );

    this.appointmentDialogVisibility = true;
  }

  editRecord(arg: any) {
    this.createAppointmentModel = new CreateAppointmentCommandModel();
    this.createAppointmentModel.startDate =
      this.date.transform(arg.event.startStr, 'dd.MM.yyyy HH:mm') ?? '';
    this.createAppointmentModel.endDate =
      this.date.transform(arg.event.endStr, 'dd.MM.yyyy HH:mm') ?? '';

    this.appointmentDialogVisibility = true;
  }

  saveAppointment(form: FormGroup) {
    if (form.valid) {
      this.http.post(
        'appointments/create',
        this.createAppointmentModel,
        res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.data,
            life: 3000
          });

          this.appointmentDialogVisibility = false;
          this.createAppointmentModel = new CreateAppointmentCommandModel();

          this.getAllAppointmentsByPatientId();
        }
      );
    }
  }

  deleteRecord(arg: any) {
    const cancelAppointmentByIdCommandModel =
      new CancelAppointmentByIdCommandModel();

    cancelAppointmentByIdCommandModel.id = arg.event.id;

    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel ' + arg.event.title + '?',
      header: 'Confirm',
      accept: () => {
        this.http.post<string>(
          'appointments/cancelbyid',
          cancelAppointmentByIdCommandModel,
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: `User ${arg.event.title} Cancelled`,
              life: 3000
            });

            this.getAllAppointmentsByPatientId();
          }
        );
      }
    });
  }

  changeVisibility(visibility: boolean) {
    this.appointmentDialogVisibility = visibility;
  }

  getAllDoctorsByDepartmentId(departmentId: number) {
    const getAllDoctorsByDepartmentIdQueryModel =
      new GetAllDoctorsByDepartmentIdQueryModel();

    getAllDoctorsByDepartmentIdQueryModel.departmentId = departmentId;

    if (departmentId != 0) {
      this.http.post(
        'doctors/getallbydepartmentid',
        getAllDoctorsByDepartmentIdQueryModel,
        res => {
          this.doctors = res.data;
        }
      );
    }
  }

  getAllAppointmentsByPatientId() {
    const patientId = Number(this.authService.tokenDecode.patientId);

    const getAllAppointmentsByPatientIdAndByStatusQueryModel =
      new GetAllAppointmentsByPatientIdAndByStatusQueryModel();

    getAllAppointmentsByPatientIdAndByStatusQueryModel.patientId = patientId;
    getAllAppointmentsByPatientIdAndByStatusQueryModel.status = 4;

    if (patientId != 0) {
      this.http.post<
        GetAllAppointmentsByPatientIdAndByStatusQueryResponseModel[]
      >(
        'appointments/getallbypatientidandbystatus',
        getAllAppointmentsByPatientIdAndByStatusQueryModel,
        res => {
          this.appointments = res.data;

          const calendar = this.calendarComponent.getApi();

          calendar.removeAllEvents();

          for (let i = 0; i < this.appointments.length; i++) {
            calendar.addEvent({
              id: this.appointments[i].id,
              start: this.appointments[i].startDate,
              end: this.appointments[i].endDate,
              title: this.appointments[i].title
            });
          }
        }
      );
    }
  }
}
