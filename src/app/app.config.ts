import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MapperModule } from '@dynamic-mapper/angular';
import { DoctorMappingProfile } from './mapping/doctor.mapping.profile';
import { PatientMappingProfile } from './mapping/patient.mapping.profile';
import { UserMappingProfile } from './mapping/user.mapping.profile';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(MapperModule.withProfiles([DoctorMappingProfile, PatientMappingProfile, UserMappingProfile]))
  ]
};
