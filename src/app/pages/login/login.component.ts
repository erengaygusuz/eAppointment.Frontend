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
    TranslateModule
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
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginRequestModel: LoginCommandModel = new LoginCommandModel();

  loginValidationControl: any;

  loginFormModel: LoginValidationModel = new LoginValidationModel();

  formValidator: LoginFormValidator = new LoginFormValidator();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  constructor(
    private http: HttpService,
    private router: Router,
    public layoutService: LayoutService,
    private readonly mapper: Mapper,
    private translate: TranslateService,
    private languageService: LanguageService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.formValidator.getTranslationData(this.translate);

        this.loginValidationControl = {};
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
}
