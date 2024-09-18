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
import { GetDoctorByIdQueryResponseModel } from '../../../../models/doctors/get.doctor.by.id.query.response.model';
import { UpdateDoctorByIdCommandModel } from '../../../../models/doctors/update.doctor.by.id.command.model';
import { ToastModule } from 'primeng/toast';
import { GetAllDepartmentsQueryResponseModel } from '../../../../models/departments/get.all.departments.query.response.model';
import { GetDoctorByIdQueryModel } from '../../../../models/doctors/get.doctor.by.id.query.model';
import { UpdateDoctorFormValidator } from '../../../../validators/update.doctor.form.validator';
import { UpdateDoctorByIdValidationModel } from '../../../../models/doctors/update.doctor.by.id.validation.model';
import { Mapper } from '@dynamic-mapper/angular';
import { DoctorMappingProfile } from '../../../../mapping/doctor.mapping.profile';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language.service';

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
    TranslateModule
  ],
  templateUrl: './update-doctor.component.html',
  styleUrl: './update-doctor.component.css',
  providers: [MessageService]
})
export class UpdateDoctorComponent implements OnInit, OnDestroy {
  doctor: GetDoctorByIdQueryResponseModel =
    new GetDoctorByIdQueryResponseModel();

  doctorRequestModel: UpdateDoctorByIdCommandModel =
    new UpdateDoctorByIdCommandModel();

  pageTitle: string = '';

  doctorValidationControl: any;

  doctorFormModel: UpdateDoctorByIdValidationModel =
    new UpdateDoctorByIdValidationModel();

  departments: GetAllDepartmentsQueryResponseModel[] = [];
  selectedDepartment: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();

  items: MenuItem[] = [{ label: '' }, { label: '' }, { label: '' }];
  home: MenuItem | undefined;

  formValidator: UpdateDoctorFormValidator = new UpdateDoctorFormValidator();

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  toastErrorSummary: string = '';
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

    this.getDoctorById(Number(id!));

    this.formValidator.getTranslationData(this.translate);

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData('Pages.UpdateDoctor', 'Components.Toast');

        this.formValidator.getTranslationData(this.translate);

        this.doctorValidationControl = {};
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

  getDoctorById(id: number) {
    const getDoctorByIdQueryModel = new GetDoctorByIdQueryModel();

    getDoctorByIdQueryModel.id = id;

    this.http.post<GetDoctorByIdQueryResponseModel>(
      'doctors/getbyid',
      getDoctorByIdQueryModel,
      res => {
        this.doctor = new GetDoctorByIdQueryResponseModel();

        this.doctor = res.data;

        this.doctorFormModel = this.mapper.map(
          DoctorMappingProfile.GetDoctorByIdQueryResponseModelToUpdateDoctorByIdValidationModel,
          this.doctor
        );

        this.getAllDepartments();
      }
    );
  }

  updateUser() {
    this.doctorRequestModel = new UpdateDoctorByIdCommandModel();

    const id = this.route.snapshot.paramMap.get('id');

    this.doctorRequestModel = this.mapper.map(
      DoctorMappingProfile.UpdateDoctorByIdValidationModelToUpdateDoctorByIdCommandModel,
      this.doctorFormModel
    );

    this.doctorRequestModel.id = Number(id);

    if (!(Object.keys(this.doctorValidationControl).length > 0)) {
      this.http.post(
        'doctors/updatebyid',
        this.doctorRequestModel,
        res => {
          this.messageService.add({
            severity: 'success',
            summary: this.toastSuccessSummary,
            detail: res.data,
            life: 3000
          });

          this.doctorRequestModel = new UpdateDoctorByIdCommandModel();
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

    this.updateUser();
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
