import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.css',
})
export class UserEditDialogComponent {
  title: string = 'Users Dialog';

  userForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() user: UserModel = new UserModel();
  @Input() userRoleDropdownItems: RoleModel[] = [];

  @Output() saveUser = new EventEmitter<{ form: FormGroup }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit() {
    this.isFormSubmitted = true;

    this.saveUser.emit({ form: this.userForm });
  }

  constructor() {
    this.userForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      roles: new FormControl(0, [Validators.pattern('[^0]+')]),
    });
  }
}
