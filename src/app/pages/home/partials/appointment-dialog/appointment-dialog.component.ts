import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAppointmentModel } from '../../../../models/create.appointment.model';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.css'
})
export class AppointmentDialogComponent {
  title: string = "Appointment Dialog";

  appointmentForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() appointment = new CreateAppointmentModel();
  
  @Output() saveAppointment = new EventEmitter<{ form: FormGroup }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit(){

    this.isFormSubmitted =  true;

    this.saveAppointment.emit({ form: this.appointmentForm });
  }

  constructor(){
    this.appointmentForm = new FormGroup({
      identityNumber: new FormControl("", [Validators.required]),
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      town: new FormControl("", [Validators.required]),
      fullAddress: new FormControl("", [Validators.required])
    });
  }
}
