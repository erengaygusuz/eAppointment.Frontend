import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { PatientModel } from '../../models/patient.model';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { TableColumnInfoModel } from '../../models/table.column.info.model';
import { PatientDto } from '../../dtos/patient.dto';
import { Mapper } from '@dynamic-mapper/angular';
import { PatientMappingProfile } from '../../mapping/patient.mapping.profile';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { AdvancedTableComponent } from '../../components/advanced-table/advanced-table.component';
import { PatientDialogComponent } from './partials/patient-dialog/patient-dialog.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    PageHeaderComponent,
    AdvancedTableComponent,
    PatientDialogComponent
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
  providers: [MessageService, ConfirmationService],
})
export class PatientsComponent implements OnInit {
  patients: PatientDto[] = [];

  patientModel = new PatientModel();

  patientDialogVisibility: boolean = false;

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  tableColumnInfos: TableColumnInfoModel[] = [
    {
      columnName: 'Full Name',
      columnFieldName: 'fullName',
    },
    {
      columnName: 'Identity Number',
      columnFieldName: 'identityNumber',
    },
    {
      columnName: 'City',
      columnFieldName: 'city',
    },
    {
      columnName: 'Town',
      columnFieldName: 'town',
    },
    {
      columnName: 'Full Address',
      columnFieldName: 'fullAddress',
    },
  ];

  globalFilterFieldsData: string[] = ['fullName', 'identityNumber', 'city', 'town', 'fullAddress'];

  tableName: string = 'patientsTable';

  tableSummaryInfo: string = '';

  tableSearchBoxPlaceHolder: string = 'Search Patient';

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private readonly mapper: Mapper
  ) {}

  ngOnInit(): void {
    this.getAll();

    this.items = [{ label: 'Patients' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  getAll() {
    this.http.post<PatientModel[]>('patients/getall', {}, (res) => {
      this.patients = [];

      res.data.forEach((patient: PatientModel) => {
        let patientDto = this.mapper.map(PatientMappingProfile.DomainToDto, patient);

        this.patients.push(patientDto);
      }); 
      
      this.tableSummaryInfo = `In total there are ${this.patients ? this.patients.length : 0 } patients.`;
    });
  }

  addRecord() {
    this.patientModel = new PatientModel();
    this.patientDialogVisibility = true;
  }

  editRecord(patient: PatientDto) {

    let patientFromPatientDto = this.mapper.map(PatientMappingProfile.DtoToDomain, patient);    

    this.patientModel = { ...patientFromPatientDto };
    
    this.patientDialogVisibility = true;
  }

  savePatient(form: FormGroup) {
    if (form.valid) {
      let url = '';

      if (this.patientModel.id == '') {
        url = 'patients/create';
      } else {
        url = 'patients/update';
      }

      this.http.post(url, this.patientModel, (res) => {
        console.log(res);

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000,
        });

        this.getAll();

        this.patientDialogVisibility = false;
        this.patientModel = new PatientModel();
      });
    }
  }

  deleteRecord(patient: PatientDto) {

    let patientFromPatientDto = this.mapper.map(PatientMappingProfile.DtoToDomain, patient);    

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + patientFromPatientDto.fullName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.post<string>(
          'patients/deletebyid',
          { id: patientFromPatientDto.id },
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: `Patient ${patientFromPatientDto.fullName} Deleted`,
              life: 3000,
            });

            this.getAll();
          }
        );
      },
    });
  }

  changeVisibility(visibility: boolean) {
    this.patientDialogVisibility = visibility;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
