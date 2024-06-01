import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DoctorModel } from '../../models/doctor.model';
import { departments } from '../../constants';
import { NgForm } from '@angular/forms';
import { SwalService } from '../../services/swal.service';
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

  loading: boolean = true;

  search: string = '';

  @ViewChild('addModalCloseBtn') addModalCloseBtn:
    | ElementRef<HTMLButtonElement>
    | undefined;

  @ViewChild('updateModalCloseBtn') updateModalCloseBtn:
    | ElementRef<HTMLButtonElement>
    | undefined;

  doctorModel: DoctorModel = new DoctorModel();

  doctorDialog: boolean = false;

  doctor!: DoctorModel;

  selectedDoctors!: DoctorModel[] | null;

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  selectedDepartment: SelectItem = { value: '' };

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
    private swal: SwalService,
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
      this.loading = false;
    });
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
        this.swal.callToastr(res.data, 'success');
        this.getAll();
        this.doctorDialog = false;
        this.doctorModel = new DoctorModel();
      });
    }
  }

  delete(id: string, fullName: string) {
    this.swal.callSwal(
      'Delete Doctor',
      `Are you sure you want to delete ${fullName}?`,
      () => {
        this.http.post<string>('doctors/deletebyid', { id: id }, (res) => {
          this.swal.callToastr(res.data, 'info');
          this.getAll();
        });
      }
    );
  }

  // get(data: DoctorModel) {
  //   this.updateModel = { ...data };
  //   this.updateModel.departmentValue = data.department.value;
  // }

  addRecord() {
    this.doctor = new DoctorModel();
    this.doctorDialog = true;
  }

  changeVisibility(visibility: boolean){
    this.doctorDialog = visibility;
  }

  editRecord(doctor: DoctorModel) {
    this.doctorModel = { ...doctor };

    this.doctorModel.departmentValue = doctor.department.value;

    this.doctorDialog = true;
  }

  deleteRecord(doctor: DoctorModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + doctor.fullName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.doctors = this.doctors.filter((val) => val.id !== doctor.id);
        this.doctor = new DoctorModel();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Doctor Deleted',
          life: 3000,
        });
      },
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}