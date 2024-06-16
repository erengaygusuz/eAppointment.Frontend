import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { departments } from '../../constants';
import { DepartmentModel, DoctorModel } from '../../models/doctor.model';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpService } from '../../services/http.service';
import { AppointmentModel } from '../../models/appointment.model';
import { CreateAppointmentModel } from '../../models/create.appointment.model';
import { SwalService } from '../../services/swal.service';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';
import { AppointmentDto } from '../../dtos/appointment.dto';
import { MenuItem, SelectItem } from 'primeng/api';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { TopBarService } from '../../services/topbar.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { DropdownModule } from 'primeng/dropdown';
import { AppointmentDialogComponent } from './partials/appointment-dialog/appointment-dialog.component';

declare const $: any;

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
    AppointmentDialogComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe],
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
    eventClick: (arg) => this.handleEventClick(arg),
    expandRows: true,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    events: [
      {
        title: 'event 1',
        start: '2024-06-12T09:00:00+03:00',
        end: '2024-06-12T09:30:00+03:00',
      },
    ],
  };
  
  departments = departments;
  doctors: DoctorModel[] = [];

  selectedDepartment: DepartmentModel = new DepartmentModel();
  selectedDoctor: DoctorModel = new DoctorModel();

  appointments: AppointmentModel[] = [];

  createAppointmentModel = new CreateAppointmentModel();

  appointmentDialogVisibility: boolean = false;

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  @ViewChild('appointmentCalendar')
  calendarComponent!: FullCalendarComponent;

  selectedEndDateStr: string = "";

  departmentDropdownItems: DepartmentModel[] = [];

  constructor(
    private http: HttpService,
    private date: DatePipe,
    private swal: SwalService,
    private topbarService: TopBarService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Appointments' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.topbarService.subject.subscribe(() => {
      this.updateCalendarSize();
    });

    for (let i = 0; i < departments.length; i++){
      this.departmentDropdownItems.push(
        { 
          name: departments[i].name, 
          value: departments[i].value
        }
      )
    }
  }

  handleDateClick(arg: any) {
    this.addRecord(arg);
  }

  handleEventClick(arg: any) {
    this.addRecord(arg);
  }

  updateCalendarSize() {
    setTimeout(() => {
      this.calendarComponent.getApi().updateSize();
    }, 200);
  }

  addRecord(arg: any) {

    this.createAppointmentModel = new CreateAppointmentModel();
    this.createAppointmentModel.startDate = this.date.transform(arg.dateStr, "dd.MM.yyyy HH:mm") ?? "";

    let endDate: Date = new Date(arg.date);
    endDate.setMinutes(endDate.getMinutes() + 30);

    this.createAppointmentModel.endDate = this.date.transform(endDate, "dd.MM.yyyy HH:mm") ?? "";
    this.createAppointmentModel.doctorId = this.selectedDoctor.id;

    console.log(this.createAppointmentModel);

    this.appointmentDialogVisibility = true;
  }

  editRecord(appointment: AppointmentDto) {}

  saveAppointment(form: FormGroup) {

  }

  deleteRecord(appointment: AppointmentDto) {}

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
        }
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
        }
      );
    }
  }

  // getPatientByIdentityNumber(){
  //   this.http.post("appointments/getpatientbyidentitynumber", {
  //     identityNumber: this.createAppointmentModel.identityNumber
  //   }, res => {
  //     if(res.data !== null){
  //       this.createAppointmentModel.patientId = res.data.id;
  //       this.createAppointmentModel.firstName = res.data.firstName;
  //       this.createAppointmentModel.lastName = res.data.lastName;
  //       this.createAppointmentModel.city = res.data.city;
  //       this.createAppointmentModel.town = res.data.town;
  //       this.createAppointmentModel.fullAddress = res.data.fullAddress;
  //     }else{
  //       this.createAppointmentModel.patientId = null;
  //       this.createAppointmentModel.firstName = "";
  //       this.createAppointmentModel.lastName = "";
  //       this.createAppointmentModel.city = "";
  //       this.createAppointmentModel.town = "";
  //       this.createAppointmentModel.fullAddress = "";
  //     }
  //   })
  // }

  // create(form: NgForm){
  //   if(form.valid){
  //     this.http.post("appointments/create", this.createAppointmentModel, res => {
  //       this.swal.callToastr(res.data);
  //       this.addModalCloseBtn?.nativeElement.click();
  //       this.createAppointmentModel = new CreateAppointmentModel();
  //       this.getAllAppointmentsByDoctorId();
  //     })
  //   }
  // }

  onAppointmentDeleted(event: any) {
    event.cancel = true;
  }

  onAppointmentDeleting(event: any) {
    event.cancel = true;

    this.swal.callSwal(
      'Delete appointment?',
      `Do you want to delete ${event.appointmentData.patient.fullName} appointment?`,
      () => {
        this.http.post(
          'appointments/deletebyid',
          {
            id: event.appointmentData.id,
          },
          (res) => {
            this.swal.callToastr(res.data, 'info');
            this.getAllAppointmentsByDoctorId();
          }
        );
      }
    );
  }

  onAppointmentUpdating(event: any) {
    event.cancel = true;

    const data = {
      id: event.oldData.id,
      startDate: this.date.transform(
        event.newData.startDate,
        'dd.MM.yyyy HH:mm'
      ),
      endDate: this.date.transform(event.newData.endDate, 'dd.MM.yyyy HH:mm'),
    };

    this.http.post('appointments/update', data, (res) => {
      this.swal.callToastr(res.data);
      this.getAllAppointmentsByDoctorId();
    });
  }
}
