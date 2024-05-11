import { Component } from '@angular/core';
import { departments } from '../../constants';
import { DoctorModel } from '../../models/doctor.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DxSchedulerModule } from 'devextreme-angular';

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

  appointments: any = [
    {
      startDate: new Date("2024-05-11 09:00"),
      endDate: new Date("2024-05-11 09:30"),
      title: "Ayşe Fatma"
    },
    {
      startDate: new Date("2024-05-11 09:30"),
      endDate: new Date("2024-05-11 10:00"),
      title: "Eren Özcan"
    },
    {
      startDate: new Date("2024-05-11 10:00"),
      endDate: new Date("2024-05-11 10:30"),
      title: "Sevgi Pıtır"
    }
  ]
}
