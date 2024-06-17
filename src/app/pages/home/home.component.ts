import { Component, OnInit, ViewChild } from '@angular/core';
import { departments } from '../../constants';
import { DepartmentModel, DoctorModel } from '../../models/doctor.model';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpService } from '../../services/http.service';
import { AppointmentModel } from '../../models/appointment.model';
import { CreateAppointmentModel } from '../../models/create.appointment.model';
import { SwalService } from '../../services/swal.service';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { TopBarService } from '../../services/topbar.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { DropdownModule } from 'primeng/dropdown';
import { AppointmentDialogComponent } from './partials/appointment-dialog/appointment-dialog.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    DropdownModule,
    FullCalendarModule,
    AppointmentDialogComponent,
    ToastModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe, MessageService, ConfirmationService],
})
export class HomeComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    allDaySlot: false,
    slotMinTime: '09:00:00',
    slotMaxTime: '18:00:00',
    hiddenDays: [0, 6],
    plugins: [timeGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    eventDrop: (arg) => this.handleEventDrop(arg),
    eventClick: (arg) => this.handleEventClick(arg),
    editable: true,
    expandRows: true,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    events: [],
  };

  departments = departments;
  doctors: DoctorModel[] = [];

  selectedDepartment: DepartmentModel = new DepartmentModel();
  selectedDoctor: DoctorModel = new DoctorModel();

  appointments: AppointmentModel[] = [];

  createAppointmentModel = new CreateAppointmentModel();
  selectedAppointment = new AppointmentModel();

  appointmentDialogVisibility: boolean = false;

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  @ViewChild('appointmentCalendar')
  calendarComponent!: FullCalendarComponent;

  selectedEndDateStr: string = '';

  departmentDropdownItems: DepartmentModel[] = [];

  constructor(
    private http: HttpService,
    private date: DatePipe,
    private swal: SwalService,
    private topbarService: TopBarService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Appointments' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.topbarService.subject.subscribe(() => {
      this.updateCalendarSize();
    });

    for (let i = 0; i < departments.length; i++) {
      this.departmentDropdownItems.push({
        name: departments[i].name,
        value: departments[i].value,
      });
    }
  }

  handleDateClick(arg: any) {
    this.addRecord(arg);
  }

  handleEventDrop(arg: any) {
    const data = {
      id: arg.event.id,
      startDate:
        this.date.transform(arg.event.startStr, 'dd.MM.yyyy HH:mm') ?? '',
      endDate: this.date.transform(arg.event.endStr, 'dd.MM.yyyy HH:mm') ?? '',
    };

    this.http.post(
      'appointments/update',
      data,
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000,
        });

        this.createAppointmentModel = new CreateAppointmentModel();

        this.getAllAppointmentsByDoctorId();
      },
      () => {
        this.getAllAppointmentsByDoctorId();
      },
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
    this.createAppointmentModel = new CreateAppointmentModel();
    this.createAppointmentModel.startDate =
      this.date.transform(arg.dateStr, 'dd.MM.yyyy HH:mm') ?? '';

    const endDate: Date = new Date(arg.date);
    endDate.setMinutes(endDate.getMinutes() + 30);

    this.createAppointmentModel.endDate =
      this.date.transform(endDate, 'dd.MM.yyyy HH:mm') ?? '';
    this.createAppointmentModel.doctorId = this.selectedDoctor.id;

    this.appointmentDialogVisibility = true;
  }

  editRecord(arg: any) {
    this.createAppointmentModel = new CreateAppointmentModel();
    this.createAppointmentModel.id = arg.event.id;
    this.createAppointmentModel.identityNumber =
      arg.event.extendedProps.patient.identityNumber;
    this.createAppointmentModel.firstName =
      arg.event.extendedProps.patient.firstName;
    this.createAppointmentModel.lastName =
      arg.event.extendedProps.patient.lastName;
    this.createAppointmentModel.city = arg.event.extendedProps.patient.city;
    this.createAppointmentModel.town = arg.event.extendedProps.patient.town;
    this.createAppointmentModel.fullAddress =
      arg.event.extendedProps.patient.fullAddress;
    this.createAppointmentModel.startDate =
      this.date.transform(arg.event.startStr, 'dd.MM.yyyy HH:mm') ?? '';
    this.createAppointmentModel.endDate =
      this.date.transform(arg.event.endStr, 'dd.MM.yyyy HH:mm') ?? '';

    this.appointmentDialogVisibility = true;
  }

  saveAppointment(form: FormGroup) {
    if (form.valid) {
      let url = '';

      if (
        this.createAppointmentModel.patientId == '' ||
        this.createAppointmentModel.patientId == null
      ) {
        url = 'appointments/create';

        this.http.post(url, this.createAppointmentModel, (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.data,
            life: 3000,
          });

          this.appointmentDialogVisibility = false;
          this.createAppointmentModel = new CreateAppointmentModel();

          this.getAllAppointmentsByDoctorId();
        });
      } else {
        url = 'appointments/update';

        const data = {
          id: this.selectedAppointment.id,
          startDate: this.date.transform(
            this.selectedAppointment.startDate,
            'dd.MM.yyyy HH:mm',
          ),
          endDate: this.date.transform(
            this.selectedAppointment.endDate,
            'dd.MM.yyyy HH:mm',
          ),
        };

        this.http.post(url, data, (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.data,
            life: 3000,
          });

          this.appointmentDialogVisibility = false;
          this.createAppointmentModel = new CreateAppointmentModel();

          this.getAllAppointmentsByDoctorId();
        });
      }
    }
  }

  deleteRecord(arg: any) {
    this.swal.callSwal(
      'Delete appointment?',
      `Do you want to delete ${arg.event.extendedProps.patient.fullName} appointment?`,
      () => {
        this.http.post(
          'appointments/deletebyid',
          {
            id: arg.event.id,
          },
          (res) => {
            this.swal.callToastr(res.data, 'info');
            this.getAllAppointmentsByDoctorId();
          },
        );
      },
    );
  }

  changeVisibility(visibility: boolean) {
    this.appointmentDialogVisibility = visibility;
  }

  getAllDoctorByDepartment() {
    this.selectedDoctor = new DoctorModel();

    if (this.selectedDepartment?.value > 0) {
      this.http.post(
        'appointments/getalldoctorsbydepartment',
        {
          departmentValue: this.selectedDepartment?.value,
        },
        (res) => {
          this.doctors = res.data;
        },
      );
    }
  }

  getAllAppointmentsByDoctorId() {
    if (this.selectedDoctor.id) {
      this.http.post<AppointmentModel[]>(
        'appointments/getallbydoctorid',
        {
          doctorId: this.selectedDoctor.id,
        },
        (res) => {
          this.appointments = res.data;

          const calendar = this.calendarComponent.getApi();

          calendar.removeAllEvents();

          for (let i = 0; i < this.appointments.length; i++) {
            calendar.addEvent({
              id: this.appointments[i].id,
              start: this.appointments[i].startDate,
              end: this.appointments[i].endDate,
              title: this.appointments[i].title,
              patient: this.appointments[i].patient,
            });
          }
        },
      );
    }
  }
}
