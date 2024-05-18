import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormValidateDirective } from 'form-validate-angular';
import { UserPipe } from '../../pipes/user.pipe';
import { UserModel } from '../../models/user.model';
import { SwalService } from '../../services/swal.service';
import { HttpService } from '../../services/http.service';
import { RoleModel } from '../../models/role.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, FormValidateDirective, UserPipe, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: UserModel[] = [];
  roles: RoleModel[] = [];

  search: string = "";

  @ViewChild('addModalCloseBtn') addModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild('updateModalCloseBtn') updateModalCloseBtn: ElementRef<HTMLButtonElement> | undefined;
  
  createModel: UserModel = new UserModel();  
  updateModel: UserModel = new UserModel();  

  constructor(private http: HttpService, private swal: SwalService){
  }

  ngOnInit(): void {
    this.getAll();
    this.getAllRoles();
  }

  getAll(){
    this.http.post<UserModel[]>("users/getall", {}, (res) => {
      this.users = res.data;
    })
  }

  getAllRoles(){
    this.http.post<RoleModel[]>("users/getallroles", {}, res => {
      this.roles = res.data;
    });
  }

  add(form: NgForm){
    if(form.valid){
      this.http.post("users/create", this.createModel, (res) => {
        console.log(res);
        this.swal.callToastr(res.data, 'success');
        this.getAll();
        this.addModalCloseBtn?.nativeElement.click();
        this.createModel = new UserModel();
      })
    }
  }

  delete(id: string, fullName: string){
    this.swal.callSwal("Delete User", `Are you sure you want to delete ${fullName}?`, () => {
      this.http.post<string>("users/deletebyid", {id: id}, (res) => {
        this.swal.callToastr(res.data, 'info');
        this.getAll();
      })
    })
  }

  get(data: UserModel){
    this.updateModel = {...data};
  }

  update(form: NgForm){
    if(form.valid){
      this.http.post("users/update", this.updateModel, (res) => {
        console.log(res);
        this.swal.callToastr(res.data, 'success');
        this.getAll();
        this.updateModalCloseBtn?.nativeElement.click();
      })
    }
  }
}
