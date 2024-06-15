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
import { DoctorPipe } from '../pipes/doctor.pipe';
import { DxSchedulerModule } from 'devextreme-angular';
import { PatientPipe } from '../pipes/patient.pipe';
import { UserPipe } from '../pipes/user.pipe';
import { LoginRoutingModule } from './login/login-routing.module';
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
import { ComponentsModule } from '../components/components.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { UsersModule } from './users/users.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HomeModule } from './home/home.module';

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
    DoctorPipe,
    DxSchedulerModule,
    PatientPipe,
    UserPipe,
    CommonModule,
    LoginRoutingModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    RippleModule,
    InputTextareaModule,
    FileUploadModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    InputNumberModule,
    ComponentsModule,
    DoctorsModule,
    PatientsModule,
    UsersModule,
    FullCalendarModule,
    HomeModule
  ]
})
export class MainModule {}
