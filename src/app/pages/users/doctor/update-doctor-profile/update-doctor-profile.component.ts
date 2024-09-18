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
import { DoctorMappingProfile } from '../../../../mapping/doctor.mapping.profile';
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
import { UpdateDoctorProfileByIdCommandModel } from '../../../../models/doctors/update.doctor.profile.by.id.command.model';
import { UpdateDoctorProfileByIdValidationModel } from '../../../../models/doctors/update.doctor.profile.by.id.validation.model';
import { GetDoctorProfileByIdQueryResponseModel } from '../../../../models/doctors/get.doctor.profile.by.id.query.response.model';
import { GetDoctorProfileByIdQueryModel } from '../../../../models/doctors/get.doctor.profile.by.id.query.model';
import { UpdateDoctorProfileFormValidator } from '../../../../validators/update.doctor.profile.form.validator';
import { GetAllDepartmentsQueryResponseModel } from '../../../../models/departments/get.all.departments.query.response.model';
import { TokenService } from '../../../../services/token.service';

@Component({
  selector: 'app-update-doctor',
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
  templateUrl: './update-doctor-profile.component.html',
  styleUrl: './update-doctor-profile.component.css',
  providers: [MessageService]
})
export class UpdateDoctorProfileComponent implements OnInit, OnDestroy {
  doctor: GetDoctorProfileByIdQueryResponseModel =
    new GetDoctorProfileByIdQueryResponseModel();

  doctorRequestModel: UpdateDoctorProfileByIdCommandModel =
    new UpdateDoctorProfileByIdCommandModel();

  pageTitle: string = '';

  doctorValidationControl: any;

  doctorFormModel: UpdateDoctorProfileByIdValidationModel =
    new UpdateDoctorProfileByIdValidationModel();

  departments: GetAllDepartmentsQueryResponseModel[] = [];
  selectedDepartment: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();

  items: MenuItem[] = [{ label: '' }, { label: '' }, { label: '' }];
  home: MenuItem | undefined;

  formValidator: UpdateDoctorProfileFormValidator =
    new UpdateDoctorProfileFormValidator();

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

    const id = this.tokenService.getDoctorId();

    this.getDoctorProfileById(Number(id!));

    this.formValidator.getTranslationData(this.translate);

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData(
          'Pages.UpdateDoctorProfile',
          'Pages.UpdateDoctorProfile.Form.Controls.ProfilePhoto.ValidationMessages',
          'Components.Toast'
        );

        this.formValidator.getTranslationData(this.translate);

        this.doctorValidationControl = {};
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

  getAllDepartments() {
    this.http.post<GetAllDepartmentsQueryResponseModel[]>(
      'departments/getall',
      {},
      res => {
        this.departments = res.data;

        this.doctorFormModel.department = this.departments.filter(
          x => x.id == this.doctor.departmentId
        )[0];
      }
    );
  }

  getDoctorProfileById(id: number) {
    const getDoctorProfileByIdQueryModel = new GetDoctorProfileByIdQueryModel();

    getDoctorProfileByIdQueryModel.id = id;

    this.http.post<GetDoctorProfileByIdQueryResponseModel>(
      'doctors/getprofilebyid',
      getDoctorProfileByIdQueryModel,
      res => {
        this.doctor = new GetDoctorProfileByIdQueryResponseModel();

        this.doctor = res.data;

        this.doctorFormModel = this.mapper.map(
          DoctorMappingProfile.GetDoctorProfileByIdQueryResponseModelToUpdateDoctorProfileByIdValidationModel,
          this.doctor
        );

        this.uploadedPhoto = `data:${this.doctor.profilePhotoContentType};base64,${this.doctor.profilePhotoBase64Content}`;

        this.getAllDepartments();
      }
    );
  }

  updateUserProfile() {
    this.doctorRequestModel = new UpdateDoctorProfileByIdCommandModel();

    this.doctorRequestModel = this.mapper.map(
      DoctorMappingProfile.UpdateDoctorProfileByIdValidationModelToUpdateDoctorProfileByIdCommandModel,
      this.doctorFormModel
    );

    this.doctorRequestModel.id = this.tokenService.getDoctorId();

    const formData = new FormData();

    formData.append('id', this.doctorRequestModel.id.toString());
    formData.append('firstName', this.doctorRequestModel.firstName);
    formData.append('lastName', this.doctorRequestModel.lastName);
    formData.append('phoneNumber', this.doctorRequestModel.phoneNumber);
    formData.append(
      'profilePhoto',
      this.selectedProfilePhoto,
      this.selectedProfilePhoto.name
    );

    if (!(Object.keys(this.doctorValidationControl).length > 0)) {
      this.http.post(
        'doctors/updateprofilebyid',
        formData,
        res => {
          this.messageService.add({
            severity: 'success',
            summary: this.toastSuccessSummary,
            detail: res.data,
            life: 3000
          });

          this.getDoctorProfileById(this.doctorRequestModel.id);

          this.clearSelectedFile();

          this.doctorRequestModel = new UpdateDoctorProfileByIdCommandModel();
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
    this.doctorValidationControl = this.formValidator.validate(
      this.doctorFormModel
    );

    this.updateUserProfile();
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
