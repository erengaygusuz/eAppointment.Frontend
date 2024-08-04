import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { MapperModule } from '@dynamic-mapper/angular';
import { DoctorMappingProfile } from './mapping/doctor.mapping.profile';
import { PatientMappingProfile } from './mapping/patient.mapping.profile';
import { AdminMappingProfile } from './mapping/admin.mapping.profile';
import { LoginMappingProfile } from './mapping/login.mapping.profile';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ErrorHandlerService } from './services/error.handler.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
    ),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ErrorHandlerService
  ]
};
