import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DoctorModel } from '../../../../models/doctor.model';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctor-dialog.component.html',
  styleUrl: './doctor-dialog.component.css'
})
export class DoctorDialogComponent {

  title: string = "Doctors Dialog";

  @Input() visibility: boolean = false;
  @Input() doctor: DoctorModel = new DoctorModel();
  @Input() departmentDropdownItems: SelectItem[] = [];
  @Input() selectedDepartment: SelectItem = { value: '' };
  @Input() submitted: boolean = false;

  @Output() saveDoctor = new EventEmitter<any>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();
}
