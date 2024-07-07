import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { MapperModule } from '@dynamic-mapper/angular';
import { DoctorMappingProfile } from './mapping/doctor.mapping.profile';
import { PatientMappingProfile } from './mapping/patient.mapping.profile';
import { AdminMappingProfile } from './mapping/admin.mapping.profile';
import { LoginMappingProfile } from './mapping/login.mapping.profile';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideStore(),
    MessageService,
    importProvidersFrom(
      MapperModule.withProfiles([
        DoctorMappingProfile,
        PatientMappingProfile,
        AdminMappingProfile,
        LoginMappingProfile
      ])
    )
  ]
};
