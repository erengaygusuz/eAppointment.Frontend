import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutsComponent } from './components/layouts/layouts.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { PatientsComponent } from './components/patients/patients.component';
import { UsersComponent } from './components/users/users.component';
import { AdminAuthGuard } from './guards/admin.auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { DoctorAuthGuard } from './guards/doctor.auth.guard';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "",
        component: LayoutsComponent,
        canActivateChild: [() => inject(AuthService).isAuthenticated()],
        children: [
            {
                path: "",
                component: HomeComponent
            },
            {
                path: "doctors",
                component: DoctorsComponent,
                canActivate: [DoctorAuthGuard]
            },
            {
                path: "patients",
                component: PatientsComponent
            },
            {
                path: "users",
                component: UsersComponent,
                canActivate: [AdminAuthGuard]
            },
            {
                path: "unauthorized",
                component: UnauthorizedComponent
            }
        ]
    },
    {
        path: "**",
        component: NotFoundComponent
    }
];
