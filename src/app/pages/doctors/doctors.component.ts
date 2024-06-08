import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DoctorModel } from '../../models/doctor.model';
import { departments } from '../../constants';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService, ConfirmationService, MenuItem, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { TableColumnInfoModel } from '../../models/table.column.info.model';
import { DoctorDto } from '../../dtos/doctor.dto';
import { Mapper } from '@dynamic-mapper/angular';
import { DoctorMappingProfile } from '../../mapping/doctor.mapping.profile';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
  providers: [MessageService, ConfirmationService],
})
export class DoctorsComponent implements OnInit {
  doctors: DoctorDto[] = [];

  departments = departments;

  departmentDropdownItems: SelectItem[] = [];

  doctorModel = new DoctorModel();

  doctorDialogVisibility: boolean = false;

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  tableColumnInfos: TableColumnInfoModel[] = [
      { 
          columnName: 'Full Name', 
          columnFieldName: 'fullName'
      },
      { 
          columnName: 'Department Name', 
          columnFieldName: 'department.name'
      }
  ];

  globalFilterFieldsData: string[] = [
    'fullName', 
    'department.name'
  ];

  tableName: string = "doctorsTable";

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private readonly mapper: Mapper
  ) {}

  ngOnInit(): void {
    this.getAll();

    this.items = [
        { label: 'Doctors' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    for (let i = 0; i < departments.length; i++){
      this.departmentDropdownItems.push(
        { 
          label: departments[i].name, 
          value: departments[i].value
        }
      )
    }
    
  }

  getAll() {
    this.http.post<DoctorModel[]>('doctors/getall', {}, (res) => {

      this.doctors = [];

      res.data.forEach((doctor: DoctorModel) => {
        let doctorDto = this.mapper.map(DoctorMappingProfile.DomainToDto, doctor);

        this.doctors.push(doctorDto);
      });      
    });
  }

  addRecord() {
    this.doctorModel = new DoctorModel();
    this.doctorDialogVisibility = true;
  }

  editRecord(doctor: DoctorDto) {

    let doctorFromDoctorDto = this.mapper.map(DoctorMappingProfile.DtoToDomain, doctor);    

    this.doctorModel = { ...doctorFromDoctorDto };

    this.doctorModel.departmentValue = doctorFromDoctorDto.department.value;

    this.doctorDialogVisibility = true;
  }

  saveDoctor(form: FormGroup) {
    if (form.valid) {

      let url = "";

      if(this.doctorModel.id == '' ){
        url = 'doctors/create';
      }else{
        url = 'doctors/update';
      }

      this.http.post(url, this.doctorModel, (res) => {
        console.log(res);

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.data,
          life: 3000,
        });

        this.getAll();

        this.doctorDialogVisibility = false;
        this.doctorModel = new DoctorModel();
      });
    }
  }

  deleteRecord(doctor: DoctorDto) {
    let doctorFromDoctorDto = this.mapper.map(DoctorMappingProfile.DtoToDomain, doctor);  

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + doctorFromDoctorDto.fullName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.post<string>('doctors/deletebyid', { id: doctorFromDoctorDto.id }, (res) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `Doctor ${doctorFromDoctorDto.fullName} Deleted`,
            life: 3000,
          });

          this.getAll();
        });
      },
    });
  }

  changeVisibility(visibility: boolean){
    this.doctorDialogVisibility = visibility;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}