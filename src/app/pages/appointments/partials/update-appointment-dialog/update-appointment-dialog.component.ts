/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { UpdateAppointmentByIdValidationModel } from '../../../../models/appointments/update.appointment.by.id.validation.model';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-update-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule
  ],
  templateUrl: './update-appointment-dialog.component.html',
  styleUrl: './update-appointment-dialog.component.css',
  providers: [MessageService]
})
export class UpdateAppointmentDialogComponent {
  title: string = 'Update Appointment Dialog';

  @Input() visibility: boolean = false;
  @Input() appointment = new UpdateAppointmentByIdValidationModel();
  @Input() validationControl: any;
  @Input() appointmentStatusList: any;

  @Output() onSubmit = new EventEmitter();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();
  @Output() checkForValidation = new EventEmitter<{ propName: string }>();

  constructor() {}
}
