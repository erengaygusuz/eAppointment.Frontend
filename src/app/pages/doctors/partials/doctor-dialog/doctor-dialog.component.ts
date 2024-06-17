import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DoctorModel } from '../../../../models/doctor.model';
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

@Component({
  selector: 'app-doctor-dialog',
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
  templateUrl: './doctor-dialog.component.html',
  styleUrl: './doctor-dialog.component.css',
})
export class DoctorDialogComponent {
  title: string = 'Doctors Dialog';

  doctorForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() doctor: DoctorModel = new DoctorModel();
  @Input() departmentDropdownItems: SelectItem[] = [];

  @Output() saveDoctor = new EventEmitter<{ form: FormGroup }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit() {
    this.isFormSubmitted = true;

    this.saveDoctor.emit({ form: this.doctorForm });
  }

  constructor() {
    this.doctorForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      department: new FormControl(0, [Validators.pattern('[^0]+')]),
    });
  }
}
