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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UpdatePatientByIdCommandModel } from '../../../../models/patients/update.patient.by.id.command.model';
import { GetAllCitiesQueryResponseModel } from '../../../../models/cities/get.all.cities.query.response.model';
import { GetAllCountiesByCityIdQueryResponseModel } from '../../../../models/counties/get.all.counties.by.city.id.query.response.model';
import { GetAllCountiesByCityIdQuerymodel } from '../../../../models/counties/get.all.counties.by.city.id.query.model';
import { GetPatientByIdQueryResponseModel } from '../../../../models/patients/get.patient.by.id.query.response.model';
import { GetPatientByIdQueryModel } from '../../../../models/patients/get.patient.by.id.query.model';
import { UpdatePatientByIdValidationModel } from '../../../../models/patients/update.patient.by.id.validation.model';
import { UpdatePatientFormValidator } from '../../../../validators/update.patient.form.validator';
import { Mapper } from '@dynamic-mapper/angular';
import { PatientMappingProfile } from '../../../../mapping/patient.mapping.profile';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'app-update-patient',
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
  templateUrl: './update-patient.component.html',
  styleUrl: './update-patient.component.css',
  providers: [MessageService]
})
export class UpdatePatientComponent implements OnInit, OnDestroy {
  patient: GetPatientByIdQueryResponseModel =
    new GetPatientByIdQueryResponseModel();

  patientRequestModel: UpdatePatientByIdCommandModel =
    new UpdatePatientByIdCommandModel();

  pageTitle: string = '';

  patientValidationControl: any;

  patientFormModel: UpdatePatientByIdValidationModel =
    new UpdatePatientByIdValidationModel();

  cities: GetAllCitiesQueryResponseModel[] = [];
  selectedCity: GetAllCitiesQueryResponseModel =
    new GetAllCitiesQueryResponseModel();

  counties: GetAllCountiesByCityIdQueryResponseModel[] = [];
  selectedCounty: GetAllCountiesByCityIdQueryResponseModel =
    new GetAllCountiesByCityIdQueryResponseModel();

  items: MenuItem[] = [{ label: '' }, { label: '' }, { label: '' }];
  home: MenuItem | undefined;

  formValidator: UpdatePatientFormValidator = new UpdatePatientFormValidator();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  toastSuccessSummary: string = '';

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private readonly mapper: Mapper,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    const id = this.route.snapshot.paramMap.get('id');

    this.getPatientById(Number(id!));

    this.formValidator.getTranslationData(this.translate);

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData('Pages.UpdatePatient', 'Components.Toast');

        this.formValidator.getTranslationData(this.translate);

        this.patientValidationControl = {};
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

  getPatientById(id: number) {
    const getPatientByIdQueryModel = new GetPatientByIdQueryModel();

    getPatientByIdQueryModel.id = id;

    this.http.get<GetPatientByIdQueryResponseModel>(
      'patients/getbyid?id=' + getPatientByIdQueryModel.id,
      res => {
        this.patient = new GetPatientByIdQueryResponseModel();

        this.patient = res.data;

        this.patientFormModel = this.mapper.map(
          PatientMappingProfile.GetPatientByIdQueryResponseModelToUpdatePatientByIdValidationModel,
          this.patient
        );

        this.getAllCities();
      }
    );
  }

  getAllCities() {
    this.http.get<GetAllCitiesQueryResponseModel[]>('cities/getall', res => {
      this.cities = res.data;

      this.patientFormModel.city = this.cities.filter(
        x => x.id == this.patient.cityId
      )[0];

      this.getAllCountiesByCityId(this.patientFormModel.city.id);
    });
  }

  getAllCountiesByCityId(cityId: number) {
    const getAllCountiesByCityIdQuerymodel =
      new GetAllCountiesByCityIdQuerymodel();

    getAllCountiesByCityIdQuerymodel.cityId = cityId;

    this.http.get<GetAllCountiesByCityIdQueryResponseModel[]>(
      'counties/getallbycityid?cityId=' +
        getAllCountiesByCityIdQuerymodel.cityId,
      res => {
        this.counties = res.data;

        this.patientFormModel.county = this.counties.filter(
          x => x.id == this.patient.countyId
        )[0];
      }
    );
  }

  updateUser() {
    this.patientRequestModel = new UpdatePatientByIdCommandModel();

    const id = this.route.snapshot.paramMap.get('id');

    this.patientRequestModel = this.mapper.map(
      PatientMappingProfile.UpdatePatientByIdValidationModelToUpdatePatientByIdCommandModel,
      this.patientFormModel
    );

    this.patientRequestModel.id = Number(id);

    if (!(Object.keys(this.patientValidationControl).length > 0)) {
      this.http.put('patients/updatebyid', this.patientRequestModel, res => {
        this.messageService.add({
          severity: 'success',
          summary: this.toastSuccessSummary,
          detail: res.data,
          life: 3000
        });

        this.patientRequestModel = new UpdatePatientByIdCommandModel();
        this.patientValidationControl = {};
      });
    }
  }

  onSubmit() {
    this.patientValidationControl = this.formValidator.validate(
      this.patientFormModel
    );

    this.updateUser();
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
