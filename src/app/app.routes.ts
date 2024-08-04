import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './template/layout/app.layout.component';
import { HomeComponent } from './pages/home/home.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UpdateAdminComponent } from './pages/users/admin/update-admin/update-admin.component';
import { CreateAdminComponent } from './pages/users/admin/create-admin/create-admin.component';
import { CreateDoctorComponent } from './pages/users/doctor/create-doctor/create-doctor.component';
import { UpdateDoctorComponent } from './pages/users/doctor/update-doctor/update-doctor.component';
import { CreatePatientComponent } from './pages/users/patient/create-patient/create-patient.component';
import { UpdatePatientComponent } from './pages/users/patient/update-patient/update-patient.component';
import { CreateAppointmentComponent } from './pages/appointments/create-appointment/create-appointment.component';
import { AppointmentListComponent } from './pages/appointments/appointment-list/appointment-list.component';
import { MyAppointmentsComponent } from './pages/appointments/my-appointments/my-appointments.component';
import { PermissionGuard } from './guards/permission.guard';
import { PERMISSIONS } from './enums/Permissions';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'users',
        component: UserListComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.GET_ALL_USERS] }
      },
      {
        path: 'users/admin',
        component: CreateAdminComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.CREATE_ADMIN] }
      },
      {
        path: 'users/admin/:id',
        component: UpdateAdminComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.UPDATE_ADMIN_BY_ID] }
      },
      {
        path: 'users/doctor',
        component: CreateDoctorComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.CREATE_DOCTOR] }
      },
      {
        path: 'users/doctor/:id',
        component: UpdateDoctorComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.UPDATE_DOCTOR_BY_ID] }
      },
      {
        path: 'users/patient',
        component: CreatePatientComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.CREATE_PATIENT] }
      },
      {
        path: 'users/patient/:id',
        component: UpdatePatientComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.UPDATE_PATIENT_BY_ID] }
      },
      {
        path: 'appointment',
        component: CreateAppointmentComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.CREATE_APPOINTMENT] }
      },
      {
        path: 'my-appointments',
        component: MyAppointmentsComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.GET_ALL_APPOINTMENTS_BY_PATIENT_ID] }
      },
      {
        path: 'appointments',
        component: AppointmentListComponent,
        canActivate: [PermissionGuard],
        data: { Permissions: [PERMISSIONS.GET_ALL_APPOINTMENTS_BY_DOCTOR_ID] }
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
