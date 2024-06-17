import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UpdateDoctorCommandModel } from '../../../../models/doctors/update.doctor.command.model';

@Component({
  selector: 'app-doctor-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './doctor-edit-dialog.component.html',
  styleUrl: './doctor-edit-dialog.component.css',
})
export class DoctorEditDialogComponent {
  title: string = 'Doctors Dialog';

  doctorForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() doctor: UpdateDoctorCommandModel = new UpdateDoctorCommandModel();
  @Input() departmentDropdownItems: SelectItem[] = [];

  @Output() updateDoctor = new EventEmitter<{ form: FormGroup }>();
  @Output() changeEditDialogVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit() {
    this.isFormSubmitted = true;

    this.updateDoctor.emit({ form: this.doctorForm });
  }

  constructor() {
    this.doctorForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      department: new FormControl(0, [Validators.pattern('[^0]+')]),
    });
  }
}
