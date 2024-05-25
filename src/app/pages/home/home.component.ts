import { Component, ElementRef, ViewChild } from '@angular/core';
import { departments } from '../../constants';
import { DoctorModel } from '../../models/doctor.model';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpService } from '../../services/http.service';
import { AppointmentModel } from '../../models/appointment.model';
import { CreateAppointmentModel } from '../../models/create-appointment.model';
import { SwalService } from '../../services/swal.service';

declare const $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe]
})
export class HomeComponent {
  departments = departments;
  doctors: DoctorModel[] = [];

  selectedDepartmentValue: number = 0;
  selectedDoctorId: string = "";

  appointments: AppointmentModel[] = [];

  createAppointmentModel: CreateAppointmentModel = new CreateAppointmentModel();

  @ViewChild("addModalCloseBtn") addModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;

  constructor(private http: HttpService, private date: DatePipe, private swal: SwalService){

  }

  getAllDoctorByDepartment(){

    this.selectedDoctorId = "";

    if(this.selectedDepartmentValue > 0){
      this.http.post("appointments/getalldoctorsbydepartment", {
        departmentValue: +this.selectedDepartmentValue
      },(res) => {
        this.doctors = res.data;
      });
    }
  }

  getAllAppointmentsByDoctorId(){
    console.log(this.selectedDoctorId);

    if(this.selectedDoctorId){
      this.http.post<AppointmentModel[]>("appointments/getallbydoctorid", {
        doctorId: this.selectedDoctorId
      },(res) => {
        this.appointments = res.data;
      });
    }
  }

  onAppointmentFormOpening(event: any){
    event.cancel = true;
    
    this.createAppointmentModel.startDate = this.date.transform(event.appointmentData.startDate, "dd.MM.yyyy HH:mm") ?? "";
    this.createAppointmentModel.endDate = this.date.transform(event.appointmentData.endDate, "dd.MM.yyyy HH:mm") ?? "";
    this.createAppointmentModel.doctorId = this.selectedDoctorId;

    $("#addModal").modal("show");
  }

  getPatientByIdentityNumber(){
    this.http.post("appointments/getpatientbyidentitynumber", {
      identityNumber: this.createAppointmentModel.identityNumber
    }, res => {
      if(res.data !== null){
        this.createAppointmentModel.patientId = res.data.id;
        this.createAppointmentModel.firstName = res.data.firstName;
        this.createAppointmentModel.lastName = res.data.lastName;
        this.createAppointmentModel.city = res.data.city;
        this.createAppointmentModel.town = res.data.town;
        this.createAppointmentModel.fullAddress = res.data.fullAddress;
      }else{
        this.createAppointmentModel.patientId = null;
        this.createAppointmentModel.firstName = "";
        this.createAppointmentModel.lastName = "";
        this.createAppointmentModel.city = "";
        this.createAppointmentModel.town = "";
        this.createAppointmentModel.fullAddress = "";
      }
    })
  }

  create(form: NgForm){
    if(form.valid){
      this.http.post("appointments/create", this.createAppointmentModel, res => {
        this.swal.callToastr(res.data);
        this.addModalCloseBtn?.nativeElement.click();
        this.createAppointmentModel = new CreateAppointmentModel();
        this.getAllAppointmentsByDoctorId();
      })
    }
  }

  onAppointmentDeleted(event: any){
    event.cancel = true;
  }

  onAppointmentDeleting(event: any){
    event.cancel = true;

    this.swal.callSwal("Delete appointment?", `Do you want to delete ${event.appointmentData.patient.fullName} appointment?`, () => {
      this.http.post("appointments/deletebyid", {
        id: event.appointmentData.id
      }, res => {
        this.swal.callToastr(res.data, "info");
        this.getAllAppointmentsByDoctorId();
      })
    });
  }

  onAppointmentUpdating(event: any){
    event.cancel = true;

    const data = {
      id: event.oldData.id,
      startDate: this.date.transform(event.newData.startDate, "dd.MM.yyyy HH:mm"),
      endDate: this.date.transform(event.newData.endDate, "dd.MM.yyyy HH:mm")
    }

    this.http.post("appointments/update", data, res => {
      this.swal.callToastr(res.data);
      this.getAllAppointmentsByDoctorId();
    })
  }
}
