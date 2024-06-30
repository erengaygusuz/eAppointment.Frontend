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
  patient: CreatePatientCommandModel = new CreatePatientCommandModel();
  patientValidation: any;

  cities: GetAllCitiesQueryResponseModel[] = [];
  selectedCity: GetAllCitiesQueryResponseModel =
    new GetAllCitiesQueryResponseModel();

  counties: GetAllCountiesByCityIdQueryResponseModel[] = [];
  selectedCounty: GetAllCountiesByCityIdQueryResponseModel =
    new GetAllCountiesByCityIdQueryResponseModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  isFormSubmitted: boolean = false;

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
    this.patient.countyId = this.selectedCounty.id;

    if (!Object.keys(this.patientValidation)) {
      this.http.post('patients/create', this.patient, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });
        this.patient = new CreatePatientCommandModel();
        this.patientValidation = {};
      });
    }
  }

  onSubmit() {
    this.isFormSubmitted = true;

    this.patientValidation = this.formValidator.validate(this.patient);

    this.createUser();
  }

  checkForValidation() {
    this.patientValidation = this.formValidator.validate(this.patient);
  }
}
