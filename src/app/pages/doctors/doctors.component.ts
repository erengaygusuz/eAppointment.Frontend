import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DoctorModel } from '../../models/doctor.model';
import { departments } from '../../constants';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService, ConfirmationService, MenuItem, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { TableColumnInfoModel } from '../../models/table.column.info.model';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
  providers: [MessageService, ConfirmationService],
})
export class DoctorsComponent implements OnInit {
  doctors: DoctorModel[] = [];

  departments = departments;

  departmentDropdownItems: SelectItem[] = [];

  doctorModel = new DoctorModel();

  doctorDialog: boolean = false;

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
    private confirmationService: ConfirmationService
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
      this.doctors = res.data;
    });
  }

  addRecord() {
    this.doctorModel = new DoctorModel();
    this.doctorDialog = true;
  }

  editRecord(doctor: DoctorModel) {
    this.doctorModel = { ...doctor };

    this.doctorModel.departmentValue = doctor.department.value;

    this.doctorDialog = true;
  }

  saveDoctor(form: NgForm) {
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

        this.doctorDialog = false;
        this.doctorModel = new DoctorModel();
      });
    }
  }

  deleteRecord(doctor: DoctorModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + doctor.fullName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.post<string>('doctors/deletebyid', { id: doctor.id }, (res) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `Doctor ${doctor.fullName} Deleted`,
            life: 3000,
          });

          this.getAll();
        });
      },
    });
  }

  changeVisibility(visibility: boolean){
    this.doctorDialog = visibility;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}