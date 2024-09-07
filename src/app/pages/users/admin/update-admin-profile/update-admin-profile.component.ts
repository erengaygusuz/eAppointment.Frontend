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
import { GetAdminByIdQueryResponseModel } from '../../../../models/admins/get.admin.by.id.query.response.model';
import { UpdateAdminByIdCommandModel } from '../../../../models/admins/update.admin.by.id.command.model';
import { ToastModule } from 'primeng/toast';
import { GetAdminByIdQueryModel } from '../../../../models/admins/get.admin.by.id.query.model';
import { UpdateAdminByIdValidationModel } from '../../../../models/admins/update.admin.by.id.validation.model';
import { UpdateAdminFormValidator } from '../../../../validators/update.admin.form.validator';
import { AdminMappingProfile } from '../../../../mapping/admin.mapping.profile';
import { Mapper } from '@dynamic-mapper/angular';
import { LanguageService } from '../../../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';

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
    AvatarModule,
    CardModule,
    ImageModule
  ],
  templateUrl: './update-admin-profile.component.html',
  styleUrl: './update-admin-profile.component.css',
  providers: [MessageService]
})
export class UpdateAdminProfileComponent implements OnInit, OnDestroy {
  admin: GetAdminByIdQueryResponseModel = new GetAdminByIdQueryResponseModel();

  adminRequestModel: UpdateAdminByIdCommandModel =
    new UpdateAdminByIdCommandModel();

  pageTitle: string = '';

  adminValidationControl: any;

  adminFormModel: UpdateAdminByIdValidationModel =
    new UpdateAdminByIdValidationModel();

  items: MenuItem[] = [{ label: '' }, { label: '' }, { label: '' }];
  home: MenuItem | undefined;

  formValidator: UpdateAdminFormValidator = new UpdateAdminFormValidator();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  uploadedPhoto: string = '/assets/images/profile/admin-1.png';

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

    this.getAdminById(Number(id!));

    this.formValidator.getTranslationData(this.translate);

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData('Pages.UpdateAdmin');

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

  getAdminById(id: number) {
    const getAdminByIdQueryModel = new GetAdminByIdQueryModel();

    getAdminByIdQueryModel.id = id;

    this.http.post<GetAdminByIdQueryResponseModel>(
      'admins/getbyid',
      getAdminByIdQueryModel,
      res => {
        this.admin = new GetAdminByIdQueryResponseModel();

        this.admin = res.data;

        this.adminFormModel = this.mapper.map(
          AdminMappingProfile.GetAdminByIdQueryResponseModelToUpdateAdminByIdValidationModel,
          this.admin
        );
      }
    );
  }

  updateUser() {
    this.adminRequestModel = new UpdateAdminByIdCommandModel();

    const id = this.route.snapshot.paramMap.get('id');

    this.adminRequestModel = this.mapper.map(
      AdminMappingProfile.UpdateAdminByIdValidationModelToUpdateAdminByIdCommandModel,
      this.adminFormModel
    );

    this.adminRequestModel.id = Number(id);

    if (!(Object.keys(this.adminValidationControl).length > 0)) {
      this.http.post('admins/updatebyid', this.adminRequestModel, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });

        this.adminRequestModel = new UpdateAdminByIdCommandModel();
      });
    }
  }

  onSubmit() {
    this.adminValidationControl = this.formValidator.validate(
      this.adminFormModel
    );

    this.updateUser();
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

  onUpload(event: FileUploadEvent) {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Basic Mode'
    });
  }
}
