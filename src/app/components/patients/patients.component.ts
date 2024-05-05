import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PatientModel } from '../../models/patient.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidateDirective } from 'form-validate-angular';
import { PatientPipe } from '../../pipes/patient.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, FormValidateDirective, PatientPipe, RouterLink],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientComponent implements OnInit {
  patients: PatientModel[] = [];

  search: string = "";

  @ViewChild('addModalCloseBtn') addModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild('updateModalCloseBtn') updateModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;
  
  createModel: PatientModel = new PatientModel();  
  updateModel: PatientModel = new PatientModel();  

  constructor(private http: HttpService, private swal: SwalService){
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.http.post<PatientModel[]>("patients/getall", {}, (res) => {
      this.patients = res.data;
    })
  }

  add(form: NgForm){
    if(form.valid){
      this.http.post("patients/create", this.createModel, (res) => {
        console.log(res);
        this.swal.callToastr(res.data, 'success');
        this.getAll();
        this.addModalCloseBtn?.nativeElement.click();
        this.createModel = new PatientModel();
      })
    }
  }

  delete(id: string, fullName: string){
    this.swal.callSwal("Delete Patient", `Are you sure you want to delete ${fullName}?`, () => {
      this.http.post<string>("patients/deletebyid", {id: id}, (res) => {
        this.swal.callToastr(res.data, 'info');
        this.getAll();
      })
    })
  }

  get(data: PatientModel){
    this.updateModel = {...data};
  }

  update(form: NgForm){
    if(form.valid){
      this.http.post("patients/update", this.updateModel, (res) => {
        console.log(res);
        this.swal.callToastr(res.data, 'success');
        this.getAll();
        this.updateModalCloseBtn?.nativeElement.click();
      })
    }
  }
}
