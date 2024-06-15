import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormValidateDirective } from 'form-validate-angular';
import { AppointmentDialogComponent } from './partials/appointment-dialog/appointment-dialog.component';

@NgModule({
  declarations: [
    AppointmentDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterLink,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    InputTextareaModule,
    FileUploadModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    InputNumberModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    FormValidateDirective,
    ReactiveFormsModule
  ],
  exports:[
    AppointmentDialogComponent
  ]
})
export class HomeModule {}
