import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginCommandModel } from '../../models/auth/login.command.model';
import { HttpService } from '../../services/http.service';
import { LoginCommandResponseModel } from '../../models/auth/login.command.response.model';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/app.layout.service';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginComponent {
  login: LoginCommandModel = new LoginCommandModel();

  valCheck: string[] = ['remember'];

  password!: string;

  constructor(
    private http: HttpService,
    private router: Router,
    public layoutService: LayoutService,
  ) {}

  signIn(form: NgForm) {
    if (form.valid) {
      this.http.post<LoginCommandResponseModel>('auth/login', this.login, (res) => {
        localStorage.setItem('token', res.data!.token);
        this.router.navigateByUrl('/');
      });
    }
  }
}
