import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
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

  updatePatient: UpdatePatientByIdCommandModel =
    new UpdatePatientByIdCommandModel();

  cities: GetAllCitiesQueryResponseModel[] = [];
  selectedCity: GetAllCitiesQueryResponseModel =
    new GetAllCitiesQueryResponseModel();

  counties: GetAllCountiesByCityIdQueryResponseModel[] = [];
  selectedCounty: GetAllCountiesByCityIdQueryResponseModel =
    new GetAllCountiesByCityIdQueryResponseModel();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  patientForm: FormGroup;

  isFormSubmitted: boolean = false;

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.patientForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      identityNumber: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      city: new FormControl(0, [Validators.pattern('[^0]+')]),
      county: new FormControl(0, [Validators.pattern('[^0]+')]),
      fullAddress: new FormControl('', [Validators.required])
    });
  }

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

        console.log(res.data);

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

        this.selectedCity = this.cities.filter(
          x => x.id == this.patient.cityId
        )[0];

        this.getAllCountiesByCityId(this.selectedCity.id);
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

        this.selectedCounty = this.counties.filter(
          x => x.id == this.patient.countyId
        )[0];
      }
    );
  }

  updateUser() {
    if (this.patientForm.valid) {
      this.updatePatient = new UpdatePatientByIdCommandModel();

      const id = this.route.snapshot.paramMap.get('id');

      this.updatePatient.id = Number(id);
      this.updatePatient.firstName = this.patient.firstName;
      this.updatePatient.lastName = this.patient.lastName;
      this.updatePatient.email = this.patient.email;
      this.updatePatient.identityNumber = this.patient.identityNumber;
      this.updatePatient.userName = this.patient.userName;
      this.updatePatient.phoneNumber = this.patient.phoneNumber;
      this.updatePatient.countyId = this.selectedCounty.id;
      this.updatePatient.fullAddress = this.patient.fullAddress;

      this.http.post('patients/updatebyid', this.updatePatient, res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000
        });

        this.updatePatient = new UpdatePatientByIdCommandModel();
      });
    }
  }

  onSubmit() {
    this.isFormSubmitted = true;

    this.updateUser();
  }
}
