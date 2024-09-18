import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { PatientMappingProfile } from '../../../../mapping/patient.mapping.profile';
import { Mapper } from '@dynamic-mapper/angular';
import { LanguageService } from '../../../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FileSelectEvent,
  FileUpload,
  FileUploadModule
} from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { UpdatePatientProfileByIdCommandModel } from '../../../../models/patients/update.patient.profile.by.id.command.model';
import { GetPatientProfileByIdQueryResponseModel } from '../../../../models/patients/get.patient.profile.by.id.query.response.model';
import { GetPatientProfileByIdQueryModel } from '../../../../models/patients/get.patient.profile.by.id.query.model';
import { UpdatePatientProfileByIdValidationModel } from '../../../../models/patients/update.patient.profile.by.id.validation.model';
import { UpdatePatientProfileFormValidator } from '../../../../validators/update.patient.profile.form.validator';
import { GetAllCitiesQueryResponseModel } from '../../../../models/cities/get.all.cities.query.response.model';
import { GetAllCountiesByCityIdQueryResponseModel } from '../../../../models/counties/get.all.counties.by.city.id.query.response.model';
import { GetAllCountiesByCityIdQuerymodel } from '../../../../models/counties/get.all.counties.by.city.id.query.model';
import { TokenService } from '../../../../services/token.service';

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
    TranslateModule,
    FileUploadModule,
    CardModule,
    ImageModule
  ],
  templateUrl: './update-patient-profile.component.html',
  styleUrl: './update-patient-profile.component.css',
  providers: [MessageService]
})
export class UpdatePatientProfileComponent implements OnInit, OnDestroy {
  patient: GetPatientProfileByIdQueryResponseModel =
    new GetPatientProfileByIdQueryResponseModel();

  patientRequestModel: UpdatePatientProfileByIdCommandModel =
    new UpdatePatientProfileByIdCommandModel();

  pageTitle: string = '';

  patientValidationControl: any;

  patientFormModel: UpdatePatientProfileByIdValidationModel =
    new UpdatePatientProfileByIdValidationModel();

  cities: GetAllCitiesQueryResponseModel[] = [];
  selectedCity: GetAllCitiesQueryResponseModel =
    new GetAllCitiesQueryResponseModel();

  counties: GetAllCountiesByCityIdQueryResponseModel[] = [];
  selectedCounty: GetAllCountiesByCityIdQueryResponseModel =
    new GetAllCountiesByCityIdQueryResponseModel();

  items: MenuItem[] = [{ label: '' }, { label: '' }, { label: '' }];
  home: MenuItem | undefined;

  formValidator: UpdatePatientProfileFormValidator =
    new UpdatePatientProfileFormValidator();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  uploadedPhoto: string = '';
  emptyUserPhoto: string = '/assets/images/profile/user.png';

  selectedProfilePhoto: File = new File([], '');

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  notCorrectTypeSummaryMessage: string = '';
  notCorrectTypeDetailMessage: string = '';
  notCorrectSizeSummaryMessage: string = '';
  notCorrectSizeDetailMessage: string = '';

  toastErrorSummary: string = '';
  toastSuccessSummary: string = '';

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private readonly mapper: Mapper,
    private translate: TranslateService,
    private languageService: LanguageService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    const id = this.tokenService.getPatientId();

    this.getPatientProfileById(Number(id!));

    this.formValidator.getTranslationData(this.translate);

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData(
          'Pages.UpdatePatientProfile',
          'Pages.UpdatePatientProfile.Form.Controls.ProfilePhoto.ValidationMessages',
          'Components.Toast'
        );

        this.formValidator.getTranslationData(this.translate);

        this.patientValidationControl = {};
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTranslationData(key1: string, key2: string, key3: string) {
    this.translate.get(key1).subscribe(data => {
      this.items = this.items?.map((element, index) => {
        return { ...element, label: data.BreadcrumbItems[index].Name };
      });
      this.pageTitle = data.Title;
    });

    this.translate.get(key2).subscribe(data => {
      this.notCorrectSizeSummaryMessage = data.NotCorrectSize.Summary;
      this.notCorrectSizeDetailMessage = data.NotCorrectSize.Detail;
      this.notCorrectTypeSummaryMessage = data.NotCorrectType.Summary;
      this.notCorrectTypeDetailMessage = data.NotCorrectType.Detail;
    });

    this.translate.get(key3).subscribe(data => {
      this.toastErrorSummary = data.Error.Summary;
      this.toastSuccessSummary = data.Success.Summary;
    });
  }

  getPatientProfileById(id: number) {
    const getPatientProfileByIdQueryModel =
      new GetPatientProfileByIdQueryModel();

    getPatientProfileByIdQueryModel.id = id;

    this.http.post<GetPatientProfileByIdQueryResponseModel>(
      'patients/getprofilebyid',
      getPatientProfileByIdQueryModel,
      res => {
        this.patient = new GetPatientProfileByIdQueryResponseModel();

        this.patient = res.data;

        this.patientFormModel = this.mapper.map(
          PatientMappingProfile.GetPatientProfileByIdQueryResponseModelToUpdatePatientProfileByIdValidationModel,
          this.patient
        );

        this.uploadedPhoto = `data:${this.patient.profilePhotoContentType};base64,${this.patient.profilePhotoBase64Content}`;

        this.getAllCities();
      }
    );
  }

  getAllCities() {
    this.http.post<GetAllCitiesQueryResponseModel[]>(
      'cities/getall',
      {},
      res => {
        this.cities = res.data;

        this.patientFormModel.city = this.cities.filter(
          x => x.id == this.patient.cityId
        )[0];

        this.getAllCountiesByCityId(this.patientFormModel.city.id);
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

        this.patientFormModel.county = this.counties.filter(
          x => x.id == this.patient.countyId
        )[0];
      }
    );
  }

  updateUserProfile() {
    this.patientRequestModel = new UpdatePatientProfileByIdCommandModel();

    this.patientRequestModel = this.mapper.map(
      PatientMappingProfile.UpdatePatientProfileByIdValidationModelToUpdatePatientProfileByIdCommandModel,
      this.patientFormModel
    );

    this.patientRequestModel.id = this.tokenService.getPatientId();

    const formData = new FormData();

    formData.append('id', this.patientRequestModel.id.toString());
    formData.append('firstName', this.patientRequestModel.firstName);
    formData.append('lastName', this.patientRequestModel.lastName);
    formData.append('phoneNumber', this.patientRequestModel.phoneNumber);
    formData.append('countyId', this.patientRequestModel.countyId);
    formData.append('fullAddress', this.patientRequestModel.fullAddress);
    formData.append(
      'profilePhoto',
      this.selectedProfilePhoto,
      this.selectedProfilePhoto.name
    );

    if (!(Object.keys(this.patientValidationControl).length > 0)) {
      this.http.post(
        'patients/updateprofilebyid',
        formData,
        res => {
          this.messageService.add({
            severity: 'success',
            summary: this.toastSuccessSummary,
            detail: res.data,
            life: 3000
          });

          this.getPatientProfileById(this.patientRequestModel.id);

          this.clearSelectedFile();

          this.patientRequestModel = new UpdatePatientProfileByIdCommandModel();
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
    this.patientValidationControl = this.formValidator.validate(
      this.patientFormModel
    );

    this.updateUserProfile();
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

  onSelect(event: FileSelectEvent) {
    const file = event.files[0];

    if (file.type != 'image/png') {
      this.messageService.add({
        severity: 'warn',
        summary: this.notCorrectTypeSummaryMessage,
        detail: this.notCorrectTypeDetailMessage
      });

      this.clearSelectedFile();
    } else {
      this.selectedProfilePhoto = file;
    }

    if (file.size >= 2000000) {
      this.messageService.add({
        severity: 'warn',
        summary: this.notCorrectSizeSummaryMessage,
        detail: this.notCorrectSizeDetailMessage
      });

      this.clearSelectedFile();
    } else {
      this.selectedProfilePhoto = file;
    }
  }

  clearSelectedFile() {
    this.fileUpload.clear();
    this.selectedProfilePhoto = new File([], '');
  }
}
