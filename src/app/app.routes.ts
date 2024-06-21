import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './template/layout/app.layout.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './pages/home/home.component';
import { AdminAuthGuard } from './guards/admin.auth.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UpdateAdminComponent } from './pages/users/admin/update-admin/update-admin.component';
import { CreateAdminComponent } from './pages/users/admin/create-admin/create-admin.component';
import { CreateDoctorComponent } from './pages/users/doctor/create-doctor/create-doctor.component';
import { UpdateDoctorComponent } from './pages/users/doctor/update-doctor/update-doctor.component';
import { CreatePatientComponent } from './pages/users/patient/create-patient/create-patient.component';
import { UpdatePatientComponent } from './pages/users/patient/update-patient/update-patient.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivateChild: [() => inject(AuthService).isAuthenticated()],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'users/admin',
        component: CreateAdminComponent
      },
      {
        path: 'users/admin/:id',
        component: UpdateAdminComponent
      },
      {
        path: 'users/doctor',
        component: CreateDoctorComponent
      },
      {
        path: 'users/doctor/:id',
        component: UpdateDoctorComponent
      },
      {
        path: 'users/patient',
        component: CreatePatientComponent
      },
      {
        path: 'users/patient/:id',
        component: UpdatePatientComponent
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
