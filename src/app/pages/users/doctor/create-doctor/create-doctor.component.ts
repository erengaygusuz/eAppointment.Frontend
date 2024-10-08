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
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { CreateDoctorCommandModel } from '../../../../models/doctors/create.doctor.command.model';
import { GetAllDepartmentsQueryResponseModel } from '../../../../models/departments/get.all.departments.query.response.model';
import { CreateDoctorValidationModel } from '../../../../models/doctors/create.doctor.validation.model';
import { CreateDoctorFormValidator } from '../../../../validators/create.doctor.form.validator';
import { Mapper } from '@dynamic-mapper/angular';
import { DoctorMappingProfile } from '../../../../mapping/doctor.mapping.profile';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-doctor',
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
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.css',
  providers: [MessageService]
})
export class CreateDoctorComponent implements OnInit, OnDestroy {
  doctorRequestModel: CreateDoctorCommandModel = new CreateDoctorCommandModel();

  pageTitle: string = '';

  doctorValidationControl: any;

  doctorFormModel: CreateDoctorValidationModel =
    new CreateDoctorValidationModel();

  departments: GetAllDepartmentsQueryResponseModel[] = [];
  selectedDepartment: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();

  items: MenuItem[] = [{ label: '' }, { label: '' }, { label: '' }];
  home: MenuItem | undefined;

  formValidator: CreateDoctorFormValidator = new CreateDoctorFormValidator();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

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

        this.getTranslationData('Pages.CreateDoctor', 'Components.Toast');

        this.formValidator.getTranslationData(this.translate);

        this.doctorValidationControl = {};

        this.getAllDepartments();
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
      this.toastSuccessSummary = data.Success.Summary;
    });
  }

  getAllDepartments() {
    this.http.get<GetAllDepartmentsQueryResponseModel[]>(
      'departments/getall',
      res => {
        this.departments = res.data;
      }
    );
  }

  createUser() {
    this.doctorRequestModel = this.mapper.map(
      DoctorMappingProfile.CreateDoctorValidationModelToCreateDoctorCommandModel,
      this.doctorFormModel
    );

    if (!(Object.keys(this.doctorValidationControl).length > 0)) {
      this.http.post('doctors/create', this.doctorRequestModel, res => {
        this.messageService.add({
          severity: 'success',
          summary: this.toastSuccessSummary,
          detail: res.data,
          life: 3000
        });
        this.doctorRequestModel = new CreateDoctorCommandModel();
        this.doctorFormModel = new CreateDoctorValidationModel();
        this.doctorValidationControl = {};
      });
    }
  }

  onSubmit() {
    const validationResult = this.formValidator.validate(this.doctorFormModel);

    this.doctorValidationControl = validationResult;

    this.createUser();
  }

  checkForValidation(propName: string) {
    const validationResult = this.formValidator.validate(this.doctorFormModel);

    const convertedValidationResult = Object.fromEntries(
      Object.entries(validationResult)
        .filter(([key]) => key == propName)
        .map(obj => obj)
    );

    this.doctorValidationControl = convertedValidationResult;
  }
}
