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
import { CreatePatientCommandModel } from '../../../../models/patients/create.patient.command.model';
import { GetAllCitiesQueryResponseModel } from '../../../../models/cities/get.all.cities.query.response.model';
import { GetAllCountiesByCityIdQueryResponseModel } from '../../../../models/counties/get.all.counties.by.city.id.query.response.model';
import { GetAllCountiesByCityIdQuerymodel } from '../../../../models/counties/get.all.counties.by.city.id.query.model';
import { CreatePatientFormValidator } from '../../../../validators/create.patient.form.validator';
import { CreatePatientValidationModel } from '../../../../models/patients/create.patient.validation.model';
import { Mapper } from '@dynamic-mapper/angular';
import { PatientMappingProfile } from '../../../../mapping/patient.mapping.profile';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-patient',
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
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css',
  providers: [MessageService]
})
export class CreatePatientComponent implements OnInit, OnDestroy {
  patientRequestModel: CreatePatientCommandModel =
    new CreatePatientCommandModel();

  pageTitle: string = '';

  patientValidationControl: any;

  patientFormModel: CreatePatientValidationModel =
    new CreatePatientValidationModel();

  cities: GetAllCitiesQueryResponseModel[] = [];
  selectedCity: GetAllCitiesQueryResponseModel =
    new GetAllCitiesQueryResponseModel();

  counties: GetAllCountiesByCityIdQueryResponseModel[] = [];
  selectedCounty: GetAllCountiesByCityIdQueryResponseModel =
    new GetAllCountiesByCityIdQueryResponseModel();

  items: MenuItem[] = [{ label: '' }, { label: '' }, { label: '' }];
  home: MenuItem | undefined;

  formValidator: CreatePatientFormValidator = new CreatePatientFormValidator();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

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

    this.getAllCities();

    this.formValidator.getTranslationData(this.translate);

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData('Pages.CreatePatient');

        this.formValidator.getTranslationData(this.translate);

        this.patientValidationControl = {};
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTranslationData(key: string) {
    this.translate.get(key).subscribe(data => {
      this.items = this.items?.map((element, index) => {
        return { ...element, label: data.BreadcrumbItems[index].Name };
      });
      this.pageTitle = data.Title;
    });
  }

  getAllCities() {
    this.http.post<GetAllCitiesQueryResponseModel[]>(
      'cities/getall',
      {},
      res => {
        this.cities = res.data;
      }
    );
  }

  getAllCountiesByCityId(cityId: number) {
    const getAllCountiesByCityIdQuerymodel =
      new GetAllCountiesByCityIdQuerymodel();

    getAllCountiesByCityIdQuerymodel.cityId = cityId;

    this.http.post<GetAllCountiesByCityIdQueryResponseModel[]>(
      'counties/getall',
      getAllCountiesByCityIdQuerymodel,
      res => {
        this.counties = res.data;
      }
    );
  }

  createUser() {
    this.patientRequestModel = this.mapper.map(
      PatientMappingProfile.CreatePatientValidationModelToCreatePatientCommandModel,
      this.patientFormModel
    );

    if (!(Object.keys(this.patientValidationControl).length > 0)) {
      this.http.post('patients/create', this.patientRequestModel, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });
        this.patientRequestModel = new CreatePatientCommandModel();
        this.patientFormModel = new CreatePatientValidationModel();
        this.patientValidationControl = {};
      });
    }
  }

  onSubmit() {
    this.patientValidationControl = this.formValidator.validate(
      this.patientFormModel
    );

    this.createUser();
  }

  checkForValidation(propName: string) {
    const validationResult = this.formValidator.validate(this.patientFormModel);

    const convertedValidationResult = Object.fromEntries(
      Object.entries(validationResult)
        .filter(([key]) => key == propName)
        .map(obj => obj)
    );

    this.patientValidationControl = convertedValidationResult;
  }
}
