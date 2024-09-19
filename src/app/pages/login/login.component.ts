import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginCommandModel } from '../../models/auth/login.command.model';
import { HttpService } from '../../services/http.service';
import { LoginCommandResponseModel } from '../../models/auth/login.command.response.model';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/app.layout.service';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { LoginFormValidator } from '../../validators/login.form.validator';
import { LoginValidationModel } from '../../models/auth/login.validation.model';
import { Mapper } from '@dynamic-mapper/angular';
import { LoginMappingProfile } from '../../mapping/login.mapping.profile';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TranslateModule,
    ToastModule,
    DropdownModule
  ],
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `
  ],
  providers: [MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginRequestModel: LoginCommandModel = new LoginCommandModel();

  loginValidationControl: any;

  loginFormModel: LoginValidationModel = new LoginValidationModel();

  formValidator: LoginFormValidator = new LoginFormValidator();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  toastErrorSummary: string = '';

  countries: any[] | undefined;

  selectedCountry: any | undefined;

  constructor(
    private http: HttpService,
    private router: Router,
    public layoutService: LayoutService,
    private readonly mapper: Mapper,
    private translate: TranslateService,
    private languageService: LanguageService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {
    this.countries = [
      { name: '', code: 'TR', languageCode: 'tr-TR' },
      { name: '', code: 'GB', languageCode: 'en-GB' },
      { name: '', code: 'US', languageCode: 'en-US' }
    ];
  }

  ngOnInit(): void {
    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData(
          'Components.Toast.Error.Summary',
          'Topbar.LanguageOptions'
        );

        this.formValidator.getTranslationData(this.translate);

        this.loginValidationControl = {};
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTranslationData(key1: string, key2: string) {
    this.translate.get(key1).subscribe(data => {
      this.toastErrorSummary = data;
    });

    this.translate.get(key2).subscribe(data => {
      this.countries = this.countries?.map((element, index) => {
        return { ...element, name: data[index].Name };
      });

      this.selectedCountry = this.countries!.filter(
        x => x.languageCode == this.selectedLanguage
      )[0];

      this.translate.use(this.selectedCountry.languageCode);
    });
  }

  onSubmit() {
    const validationResult = this.formValidator.validate(this.loginFormModel);

    this.loginValidationControl = validationResult;

    this.logIn();
  }

  logIn() {
    this.loginRequestModel = this.mapper.map(
      LoginMappingProfile.LoginValidationModelToLoginCommandModel,
      this.loginFormModel
    );

    if (!(Object.keys(this.loginValidationControl).length > 0)) {
      this.http.post<LoginCommandResponseModel>(
        'auth/login',
        this.loginRequestModel,
        res => {
          this.tokenService.saveToken(res.data!.token);
          this.router.navigateByUrl('/');

          this.loginRequestModel = new LoginCommandModel();
          this.loginFormModel = new LoginValidationModel();
          this.loginValidationControl = {};
        },
        err => {
          this.messageService.add({
            severity: 'error',
            summary: this.toastErrorSummary,
            detail:
              err.error.errorMessages === undefined ||
              err.error.errorMessages === null
                ? ''
                : err.error.errorMessages[0],
            life: 3000
          });
        }
      );
    }
  }

  checkForValidation(propName: string) {
    const validationResult = this.formValidator.validate(this.loginFormModel);

    const convertedValidationResult = Object.fromEntries(
      Object.entries(validationResult)
        .filter(([key]) => key == propName)
        .map(obj => obj)
    );

    this.loginValidationControl = convertedValidationResult;
  }

  onLanguageChange(language: string) {
    this.translate.use(language);

    localStorage.setItem('language', language);

    this.selectedCountry = this.countries!.filter(
      x => x.languageCode == language
    )[0];

    this.languageService.setLanguage(language);
  }
}
