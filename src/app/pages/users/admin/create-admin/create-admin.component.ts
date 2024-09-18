import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { MenuItem, MessageService } from 'primeng/api';
import { HttpService } from '../../../../services/http.service';
import { AuthService } from '../../../../services/auth.service';
import { CreateAdminCommandModel } from '../../../../models/admins/create.admin.command.model';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { CreateAdminValidationModel } from '../../../../models/admins/create.admin.validation.model';
import { CreateAdminFormValidator } from '../../../../validators/create.admin.form.validator';
import { Mapper } from '@dynamic-mapper/angular';
import { AdminMappingProfile } from '../../../../mapping/admin.mapping.profile';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    InputMaskModule,
    FormsModule,
    ToastModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
  providers: [MessageService]
})
export class CreateAdminComponent implements OnInit, OnDestroy {
  adminRequestModel: CreateAdminCommandModel = new CreateAdminCommandModel();

  pageTitle: string = '';

  adminValidationControl: any;

  adminFormModel: CreateAdminValidationModel = new CreateAdminValidationModel();

  items: MenuItem[] = [{ label: '' }, { label: '' }, { label: '' }];
  home: MenuItem | undefined;

  formValidator: CreateAdminFormValidator = new CreateAdminFormValidator();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  toastErrorSummary: string = '';
  toastSuccessSummary: string = '';

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService,
    private readonly mapper: Mapper,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    this.formValidator.getTranslationData(this.translate);

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData('Pages.CreateAdmin', 'Components.Toast');

        this.formValidator.getTranslationData(this.translate);

        this.adminValidationControl = {};
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTranslationData(key1: string, key2: string) {
    this.translate.get(key1).subscribe(data => {
      this.items = this.items?.map((element, index) => {
        return { ...element, label: data.BreadcrumbItems[index].Name };
      });
      this.pageTitle = data.Title;
    });

    this.translate.get(key2).subscribe(data => {
      this.toastErrorSummary = data.Error.Summary;
      this.toastSuccessSummary = data.Success.Summary;
    });
  }

  createUser() {
    this.adminRequestModel = this.mapper.map(
      AdminMappingProfile.CreateAdminValidationModelToCreateAdminCommandModel,
      this.adminFormModel
    );

    if (!(Object.keys(this.adminValidationControl).length > 0)) {
      this.http.post(
        'admins/create',
        this.adminRequestModel,
        res => {
          this.messageService.add({
            severity: 'success',
            summary: this.toastSuccessSummary,
            detail: res.data,
            life: 3000
          });
          this.adminRequestModel = new CreateAdminCommandModel();
          this.adminFormModel = new CreateAdminValidationModel();
          this.adminValidationControl = {};
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

  onSubmit() {
    const validationResult = this.formValidator.validate(this.adminFormModel);

    this.adminValidationControl = validationResult;

    this.createUser();
  }

  checkForValidation(propName: string) {
    const validationResult = this.formValidator.validate(this.adminFormModel);

    const convertedValidationResult = Object.fromEntries(
      Object.entries(validationResult)
        .filter(([key]) => key == propName)
        .map(obj => obj)
    );

    this.adminValidationControl = convertedValidationResult;
  }
}
