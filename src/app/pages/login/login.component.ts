import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginModel } from '../../models/login.model';
import { HttpService } from '../../services/http.service';
import { LoginResponseModel } from '../../models/login-response.model';
import { Router } from '@angular/router';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
  login: LoginModel = new LoginModel();

  valCheck: string[] = ['remember'];

  password!: string;

  constructor(
    private http: HttpService, 
    private router: Router, 
    public layoutService: LayoutService)
  {

  }

  signIn(form:NgForm){
    if(form.valid){
      this.http.post<LoginResponseModel>("auth/login", this.login, (res) => {
        localStorage.setItem("token", res.data!.token);
        this.router.navigateByUrl("/");
      })
    }
  }
}
