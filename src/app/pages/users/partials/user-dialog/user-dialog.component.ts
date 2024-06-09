import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserModel } from '../../../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleModel } from '../../../../models/role.model';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent {

  title: string = "Users Dialog";

  userForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() user: UserModel = new UserModel();
  @Input() userRoleDropdownItems: RoleModel[] = [];
  
  @Output() saveUser = new EventEmitter<{ form: FormGroup }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  onSubmit(){

    this.isFormSubmitted =  true;

    this.saveUser.emit({ form: this.userForm });
  }

  constructor(){
    this.userForm = new FormGroup({
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      roles: new FormControl(0, [Validators.pattern("[^0]+")])
    });
  }
}
