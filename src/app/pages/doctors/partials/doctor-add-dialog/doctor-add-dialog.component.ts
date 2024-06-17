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
import { CreateUserCommandModel } from '../../../../models/users/create.user.command.model';

@Component({
  selector: 'app-doctor-add-dialog',
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
  templateUrl: './doctor-add-dialog.component.html',
  styleUrl: './doctor-add-dialog.component.css',
})
export class DoctorAddDialogComponent {
  title: string = 'Doctors Dialog';

  doctorForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() doctor: CreateUserCommandModel = new CreateUserCommandModel();
  @Input() departmentDropdownItems: SelectItem[] = [];

  @Output() addDoctor = new EventEmitter<{ form: FormGroup }>();
  @Output() changeAddDialogVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit() {
    this.isFormSubmitted = true;

    this.addDoctor.emit({ form: this.doctorForm });
  }

  constructor() {
    this.doctorForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      department: new FormControl(0, [Validators.pattern('[^0]+')]),
    });
  }
}
