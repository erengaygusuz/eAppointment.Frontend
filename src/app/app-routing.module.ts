import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { UsersComponent } from './pages/users/users.component';
import { AdminAuthGuard } from './guards/admin.auth.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { DoctorAuthGuard } from './guards/doctor.auth.guard';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivateChild: [() => inject(AuthService).isAuthenticated()],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'doctors',
        component: DoctorsComponent,
        canActivate: [DoctorAuthGuard],
      },
      {
        path: 'patients',
        component: PatientsComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminAuthGuard],
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
