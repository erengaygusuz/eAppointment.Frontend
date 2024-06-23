import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { MenuItem, MessageService } from 'primeng/api';
import { HttpService } from '../../../../services/http.service';
import { AuthService } from '../../../../services/auth.service';
import { CreateAdminCommandModel } from '../../../../models/admins/create.admin.command.model';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    InputMaskModule,
    FormsModule,
    ToastModule,
    RouterModule
  ],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
  providers: [MessageService]
})
export class CreateAdminComponent implements OnInit {
  admin: CreateAdminCommandModel = new CreateAdminCommandModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  adminForm: FormGroup;

  isFormSubmitted: boolean = false;

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService
  ) {
    this.adminForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordAgain: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.items = [
      { label: 'User' },
      { label: 'Admin' },
      { label: 'Create Admin' }
    ];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };
  }

  createUser() {
    if (this.adminForm.valid) {
      this.http.post('admins/create', this.admin, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });
        this.admin = new CreateAdminCommandModel();
      });
    }
  }

  onSubmit() {
    this.isFormSubmitted = true;

    this.createUser();
  }
}
