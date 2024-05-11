import { Component } from '@angular/core';
import { departments } from '../../constants';
import { DoctorModel } from '../../models/doctor.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxSchedulerModule } from 'devextreme-angular';
import { HttpService } from '../../services/http.service';
import { AppointmentModel } from '../../models/appointment.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, DxSchedulerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  departments = departments;
  doctors: DoctorModel[] = [];

  selectedDepartmentValue: number = 0;
  selectedDoctorId: number = 0;

  appointments: AppointmentModel[] = [];

  constructor(private http: HttpService){

  }

  getAllDoctorByDepartment(){

    this.selectedDoctorId = 0;

    if(this.selectedDepartmentValue > 0){
      this.http.post("appointments/getalldoctorsbydepartment", {
        departmentValue: +this.selectedDepartmentValue
      },(res) => {
        this.doctors = res.data;
      });
    }
  }

  getAllAppointmentsByDoctorId(){
    if(this.selectedDoctorId){
      this.http.post<AppointmentModel[]>("appointments/getallappointmentsbydoctorid", {
        doctorId: +this.selectedDoctorId
      },(res) => {
        this.appointments = res.data;
      });
    }
  }
}
