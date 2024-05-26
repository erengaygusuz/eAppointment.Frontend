import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsComponent } from './doctors/doctors.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PatientsComponent } from './patients/patients.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UsersComponent } from './users/users.component';
import { LayoutsComponent } from '../layouts/layouts.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { DoctorPipe } from '../pipes/doctor.pipe';
import { DxSchedulerModule } from 'devextreme-angular';
import { PatientPipe } from '../pipes/patient.pipe';
import { UserPipe } from '../pipes/user.pipe';
import { ButtonModule } from 'primeng/button';
import { LoginRoutingModule } from './login/login-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
  declarations: [
    DoctorsComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    PatientsComponent,
    UnauthorizedComponent,
    UsersComponent,
    LayoutsComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterLink,
    FormsModule,
    FormValidateDirective,
    DoctorPipe,
    DxSchedulerModule,
    PatientPipe,
    UserPipe,
    ButtonModule,
    CommonModule,
    LoginRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    TableModule,
    DialogModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextareaModule,
    FileUploadModule,
    DropdownModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    InputNumberModule,
    BreadcrumbModule
  ],
})
export class MainModule {}
