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
import { AdminMappingProfile } from '../../../../mapping/admin.mapping.profile';
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
import { UpdateAdminProfileByIdCommandModel } from '../../../../models/admins/update.admin.profile.by.id.command.model';
import { UpdateAdminProfileByIdValidationModel } from '../../../../models/admins/update.admin.profile.by.id.validation.model';
import { UpdateAdminProfileFormValidator } from '../../../../validators/update.admin.profile.form.validator';
import { GetAdminProfileByIdQueryResponseModel } from '../../../../models/admins/get.admin.profile.by.id.query.response.model';
import { GetAdminProfileByIdQueryModel } from '../../../../models/admins/get.admin.profile.by.id.query.model';

@Component({
  selector: 'app-update-admin',
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
  templateUrl: './update-admin-profile.component.html',
  styleUrl: './update-admin-profile.component.css',
  providers: [MessageService]
})
export class UpdateAdminProfileComponent implements OnInit, OnDestroy {
  admin: GetAdminProfileByIdQueryResponseModel =
    new GetAdminProfileByIdQueryResponseModel();

  adminRequestModel: UpdateAdminProfileByIdCommandModel =
    new UpdateAdminProfileByIdCommandModel();

  pageTitle: string = '';

  adminValidationControl: any;

  adminFormModel: UpdateAdminProfileByIdValidationModel =
    new UpdateAdminProfileByIdValidationModel();

  items: MenuItem[] = [{ label: '' }, { label: '' }, { label: '' }];
  home: MenuItem | undefined;

  formValidator: UpdateAdminProfileFormValidator =
    new UpdateAdminProfileFormValidator();

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

    this.getAdminProfileById(Number(id!));

    this.formValidator.getTranslationData(this.translate);

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData(
          'Pages.UpdateAdminProfile',
          'Pages.UpdateAdminProfile.Form.Controls.ProfilePhoto.ValidationMessages',
          'Components.Toast'
        );

        this.formValidator.getTranslationData(this.translate);

        this.adminValidationControl = {};
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
      this.toastSuccessSummary = data.Success.Summary;
    });
  }

  getAdminProfileById(id: number) {
    const getAdminProfileByIdQueryModel = new GetAdminProfileByIdQueryModel();

    getAdminProfileByIdQueryModel.id = id;

    this.http.get<GetAdminProfileByIdQueryResponseModel>(
      'admins/getprofilebyid/' + getAdminProfileByIdQueryModel.id,
      res => {
        this.admin = new GetAdminProfileByIdQueryResponseModel();

        this.admin = res.data;

        this.adminFormModel = this.mapper.map(
          AdminMappingProfile.GetAdminProfileByIdQueryResponseModelToUpdateAdminProfileByIdValidationModel,
          this.admin
        );

        this.uploadedPhoto = `data:${this.admin.profilePhotoContentType};base64,${this.admin.profilePhotoBase64Content}`;
      }
    );
  }

  updateUserProfile() {
    this.adminRequestModel = new UpdateAdminProfileByIdCommandModel();

    const id = this.route.snapshot.paramMap.get('id');

    this.adminRequestModel = this.mapper.map(
      AdminMappingProfile.UpdateAdminProfileByIdValidationModelToUpdateAdminProfileByIdCommandModel,
      this.adminFormModel
    );

    this.adminRequestModel.id = Number(id);

    const formData = new FormData();

    formData.append('id', this.adminRequestModel.id.toString());
    formData.append('firstName', this.adminRequestModel.firstName);
    formData.append('lastName', this.adminRequestModel.lastName);
    formData.append('phoneNumber', this.adminRequestModel.phoneNumber);
    formData.append(
      'profilePhoto',
      this.selectedProfilePhoto,
      this.selectedProfilePhoto.name
    );

    if (!(Object.keys(this.adminValidationControl).length > 0)) {
      this.http.put('admins/updateprofilebyid', formData, res => {
        this.messageService.add({
          severity: 'success',
          summary: this.toastSuccessSummary,
          detail: res.data,
          life: 3000
        });

        this.getAdminProfileById(this.adminRequestModel.id);

        this.clearSelectedFile();

        this.adminRequestModel = new UpdateAdminProfileByIdCommandModel();
      });
    }
  }

  onSubmit() {
    this.adminValidationControl = this.formValidator.validate(
      this.adminFormModel
    );

    this.updateUserProfile();
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
