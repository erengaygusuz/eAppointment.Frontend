import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DoctorModel } from '../../../../models/doctor.model';
import { SelectItem } from 'primeng/api';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctor-dialog.component.html',
  styleUrl: './doctor-dialog.component.css'
})
export class DoctorDialogComponent {

  title: string = "Doctors Dialog";

  doctorForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() doctor: DoctorModel = new DoctorModel();
  @Input() departmentDropdownItems: SelectItem[] = [];
  
  @Output() saveDoctor = new EventEmitter<{ form: FormGroup }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit(){

    this.isFormSubmitted =  true;

    this.saveDoctor.emit({ form: this.doctorForm });
  }

  constructor(){
    this.doctorForm = new FormGroup({
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      department: new FormControl(0, [Validators.pattern("[^0]+")])
    });
  }
}
