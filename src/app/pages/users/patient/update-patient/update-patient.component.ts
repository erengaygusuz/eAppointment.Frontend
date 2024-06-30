import { Component, OnInit } from '@angular/core';
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
    RouterModule
  ],
  templateUrl: './update-patient.component.html',
  styleUrl: './update-patient.component.css',
  providers: [MessageService]
})
export class UpdatePatientComponent implements OnInit {
  patient: GetPatientByIdQueryResponseModel =
    new GetPatientByIdQueryResponseModel();

  patientRequestModel: UpdatePatientByIdCommandModel =
    new UpdatePatientByIdCommandModel();

  patientValidationControl: any;

  patientFormModel: UpdatePatientByIdValidationModel =
    new UpdatePatientByIdValidationModel();

  cities: GetAllCitiesQueryResponseModel[] = [];
  selectedCity: GetAllCitiesQueryResponseModel =
    new GetAllCitiesQueryResponseModel();

  counties: GetAllCountiesByCityIdQueryResponseModel[] = [];
  selectedCounty: GetAllCountiesByCityIdQueryResponseModel =
    new GetAllCountiesByCityIdQueryResponseModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  formValidator: UpdatePatientFormValidator = new UpdatePatientFormValidator();

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'User' },
      { label: 'Patient' },
      { label: 'Update Patient' }
    ];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    const id = this.route.snapshot.paramMap.get('id');

    this.getPatientById(Number(id!));
  }

  getPatientById(id: number) {
    const getPatientByIdQueryModel = new GetPatientByIdQueryModel();

    getPatientByIdQueryModel.id = id;

    this.http.post<GetPatientByIdQueryResponseModel>(
      'patients/getbyid',
      getPatientByIdQueryModel,
      res => {
        this.patient = new GetPatientByIdQueryResponseModel();

        this.patient = res.data;

        this.patientFormModel.firstName = this.patient.firstName;
        this.patientFormModel.lastName = this.patient.lastName;
        this.patientFormModel.email = this.patient.email;
        this.patientFormModel.identityNumber = this.patient.identityNumber;
        this.patientFormModel.userName = this.patient.userName;
        this.patientFormModel.phoneNumber = this.patient.phoneNumber;
        this.patientFormModel.fullAddress = this.patient.fullAddress;

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

  updateUser() {
    this.patientRequestModel = new UpdatePatientByIdCommandModel();

    const id = this.route.snapshot.paramMap.get('id');

    this.patientRequestModel.id = Number(id);
    this.patientRequestModel.firstName = this.patientFormModel.firstName;
    this.patientRequestModel.lastName = this.patientFormModel.lastName;
    this.patientRequestModel.email = this.patientFormModel.email;
    this.patientRequestModel.identityNumber =
      this.patientFormModel.identityNumber;
    this.patientRequestModel.userName = this.patientFormModel.userName;
    this.patientRequestModel.phoneNumber = this.patientFormModel.phoneNumber;
    this.patientRequestModel.countyId = this.patientFormModel.county.id;
    this.patientRequestModel.fullAddress = this.patientFormModel.fullAddress;

    if (!(Object.keys(this.patientValidationControl).length > 0)) {
      this.http.post('patients/updatebyid', this.patientRequestModel, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
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

  checkForValidation() {
    this.patientValidationControl = this.formValidator.validate(
      this.patientFormModel
    );
  }
}
