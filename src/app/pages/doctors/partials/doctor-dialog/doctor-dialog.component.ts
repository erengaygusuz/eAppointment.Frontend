import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DoctorModel } from '../../../../models/doctor.model';
import { SelectItem } from 'primeng/api';
import { NgForm } from '@angular/forms';

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

  @Output() saveDoctor = new EventEmitter<{ form: NgForm }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  onSubmit(form: NgForm){
    this.saveDoctor.emit({ form: form });
  }
}
