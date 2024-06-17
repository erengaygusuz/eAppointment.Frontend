import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PatientModel } from '../../../../models/patient.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-patient-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
  ],
  templateUrl: './patient-dialog.component.html',
  styleUrl: './patient-dialog.component.css',
})
export class PatientDialogComponent {
  title: string = 'Patients Dialog';

  patientForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() patient: PatientModel = new PatientModel();

  @Output() savePatient = new EventEmitter<{ form: FormGroup }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit() {
    this.isFormSubmitted = true;

    this.savePatient.emit({ form: this.patientForm });
  }

  constructor() {
    this.patientForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      identityNumber: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      town: new FormControl('', [Validators.required]),
      fullAddress: new FormControl('', [Validators.required]),
    });
  }
}
