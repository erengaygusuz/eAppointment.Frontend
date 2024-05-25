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
    NavbarComponent
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
    UserPipe
  ]
})
export class MainModule { }
