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
import { RouterModule } from '@angular/router';
import { CreatePatientCommandModel } from '../../../../models/patients/create.patient.command.model';
import { GetAllCitiesQueryResponseModel } from '../../../../models/cities/get.all.cities.query.response.model';
import { GetAllCountiesByCityIdQueryResponseModel } from '../../../../models/counties/get.all.counties.by.city.id.query.response.model';
import { GetAllCountiesByCityIdQuerymodel } from '../../../../models/counties/get.all.counties.by.city.id.query.model';
import { CreatePatientFormValidator } from '../../../../validators/create.patient.form.validator';
import { CreatePatientValidationModel } from '../../../../models/patients/create.patient.validation.model';

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
    RouterModule
  ],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css',
  providers: [MessageService]
})
export class CreatePatientComponent implements OnInit {
  patientRequestModel: CreatePatientCommandModel =
    new CreatePatientCommandModel();

  patientValidationControl: any;

  patientFormModel: CreatePatientValidationModel =
    new CreatePatientValidationModel();

  cities: GetAllCitiesQueryResponseModel[] = [];
  selectedCity: GetAllCitiesQueryResponseModel =
    new GetAllCitiesQueryResponseModel();

  counties: GetAllCountiesByCityIdQueryResponseModel[] = [];
  selectedCounty: GetAllCountiesByCityIdQueryResponseModel =
    new GetAllCountiesByCityIdQueryResponseModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  formValidator: CreatePatientFormValidator = new CreatePatientFormValidator();

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'User' },
      { label: 'Patient' },
      { label: 'Create Patient' }
    ];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    this.getAllCities();
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
    this.patientRequestModel.countyId = this.selectedCounty.id;

    this.patientRequestModel.firstName = this.patientFormModel.firstName;
    this.patientRequestModel.lastName = this.patientFormModel.lastName;
    this.patientRequestModel.userName = this.patientFormModel.userName;
    this.patientRequestModel.phoneNumber = this.patientFormModel.phoneNumber;
    this.patientRequestModel.email = this.patientFormModel.email;
    this.patientRequestModel.identityNumber =
      this.patientFormModel.identityNumber;
    this.patientRequestModel.password = this.patientFormModel.password;
    this.patientRequestModel.countyId = this.patientFormModel.county.id;
    this.patientRequestModel.fullAddress = this.patientFormModel.fullAddress;

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

  checkForValidation() {
    this.patientValidationControl = this.formValidator.validate(
      this.patientFormModel
    );
  }
}
