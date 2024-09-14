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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AdminMappingProfile } from '../../../../mapping/admin.mapping.profile';
import { Mapper } from '@dynamic-mapper/angular';
import { LanguageService } from '../../../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FileSelectEvent,
  FileUploadEvent,
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

        this.getTranslationData('Pages.UpdateAdminProfile');

        this.formValidator.getTranslationData(this.translate);

        this.adminValidationControl = {};
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

  getAdminProfileById(id: number) {
    const getAdminProfileByIdQueryModel = new GetAdminProfileByIdQueryModel();

    getAdminProfileByIdQueryModel.id = id;

    this.http.post<GetAdminProfileByIdQueryResponseModel>(
      'admins/getprofilebyid',
      getAdminProfileByIdQueryModel,
      res => {
        this.admin = new GetAdminProfileByIdQueryResponseModel();

        this.admin = res.data;

        this.adminFormModel = this.mapper.map(
          AdminMappingProfile.GetAdminProfileByIdQueryResponseModelToUpdateAdminProfileByIdValidationModel,
          this.admin
        );
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

    if (!(Object.keys(this.adminValidationControl).length > 0)) {
      this.http.post(
        'admins/updateprofilebyid',
        this.adminRequestModel,
        res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: res.data,
            life: 3000
          });

          this.adminRequestModel = new UpdateAdminProfileByIdCommandModel();
        }
      );
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

  async onSelect(event: FileSelectEvent) {
    const file = event.files[0];

    this.adminRequestModel.profilePhotoPath = JSON.stringify(
      await this.getBase64(file)
    );

    console.log(this.adminRequestModel.profilePhotoPath);

    this.uploadedPhoto = this.adminRequestModel.profilePhotoPath;
  }

  async getBase64(file: File) {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      temporaryFileReader.onloadend = () => {
        resolve(temporaryFileReader.result);
      };

      if (file) {
        temporaryFileReader.readAsDataURL(file);
      }
    });
  }
}
