import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { DoctorModel } from '../../models/doctor.model';
import { CommonModule } from '@angular/common';
import { departments } from '../../constants';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { SwalService } from '../../services/swal.service';
import { DoctorPipe } from '../../pipes/doctor.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, 
    FormValidateDirective, DoctorPipe],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit{

  doctors: DoctorModel[] = [];
  departments = departments;

  search: string = "";

  @ViewChild('addModalCloseBtn') addModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild('updateModalCloseBtn') updateModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;
  createModel: DoctorModel = new DoctorModel();  
  updateModel: DoctorModel = new DoctorModel();  

  constructor(private http: HttpService, private swal: SwalService, public auth: AuthService){
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.http.post<DoctorModel[]>("doctors/getall", {}, (res) => {
      this.doctors = res.data;
    })
  }

  add(form: NgForm){
    if(form.valid){
      this.http.post("doctors/create", this.createModel, (res) => {
        console.log(res);
        this.swal.callToastr(res.data, 'success');
        this.getAll();
        this.addModalCloseBtn?.nativeElement.click();
        this.createModel = new DoctorModel();
      })
    }
  }

  delete(id: string, fullName: string){
    this.swal.callSwal("Delete Doctor", `Are you sure you want to delete ${fullName}?`, () => {
      this.http.post<string>("doctors/deletebyid", {id: id}, (res) => {
        this.swal.callToastr(res.data, 'info');
        this.getAll();
      })
    })
  }

  get(data: DoctorModel){
    this.updateModel = {...data};
    this.updateModel.departmentValue = data.department.value;
  }

  update(form: NgForm){
    if(form.valid){
      this.http.post("doctors/update", this.updateModel, (res) => {
        console.log(res);
        this.swal.callToastr(res.data, 'success');
        this.getAll();
        this.updateModalCloseBtn?.nativeElement.click();
      })
    }
  }
}
