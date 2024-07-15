import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CreateAppointmentCommandModel } from '../../../models/appointments/create.appointment.command.model';

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
  title: string = 'Appointment Dialog';

  appointmentForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() appointment = new CreateAppointmentCommandModel();

  @Output() saveAppointment = new EventEmitter<{ form: FormGroup }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit() {
    this.isFormSubmitted = true;

    this.saveAppointment.emit({ form: this.appointmentForm });
  }

  constructor() {
    this.appointmentForm = new FormGroup({});
  }
}
