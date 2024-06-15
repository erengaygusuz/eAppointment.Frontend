import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateAppointmentModel } from '../../../../models/create-appointment.model';

@Component({
  selector: 'app-appointment-dialog',
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
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required])
    });
  }
}
