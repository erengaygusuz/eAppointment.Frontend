import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PatientModel } from '../../../../models/patient.model';
import { SelectItem } from 'primeng/api';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrl: './patient-dialog.component.css'
})
export class PatientDialogComponent {

  title: string = "Patients Dialog";

  patientForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() patient: PatientModel = new PatientModel();
  
  @Output() savePatient = new EventEmitter<{ form: FormGroup }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit(){

    this.isFormSubmitted =  true;

    this.savePatient.emit({ form: this.patientForm });
  }

  constructor(){
    this.patientForm = new FormGroup({
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      department: new FormControl(0, [Validators.pattern("[^0]+")])
    });
  }
}
