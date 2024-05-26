import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DoctorModel } from '../../models/doctor.model';
import { departments } from '../../constants';
import { NgForm } from '@angular/forms';
import { SwalService } from '../../services/swal.service';
import { AuthService } from '../../services/auth.service';
import { MessageService, ConfirmationService, MenuItem, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';

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
  createModel: DoctorModel = new DoctorModel();
  updateModel: DoctorModel = new DoctorModel();

  doctorDialog: boolean = false;

  doctor!: DoctorModel;

  selectedDoctors!: DoctorModel[] | null;

  submitted: boolean = false;

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  selectedDepartment: SelectItem = { value: '' };

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

  add(form: NgForm) {
    if (form.valid) {
      this.http.post('doctors/create', this.createModel, (res) => {
        console.log(res);
        this.swal.callToastr(res.data, 'success');
        this.getAll();
        this.addModalCloseBtn?.nativeElement.click();
        this.createModel = new DoctorModel();
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

  get(data: DoctorModel) {
    this.updateModel = { ...data };
    this.updateModel.departmentValue = data.department.value;
  }

  update(form: NgForm) {
    if (form.valid) {
      this.http.post('doctors/update', this.updateModel, (res) => {
        console.log(res);
        this.swal.callToastr(res.data, 'success');
        this.getAll();
        this.updateModalCloseBtn?.nativeElement.click();
      });
    }
  }

  openNew() {
    this.doctor = new DoctorModel();
    this.submitted = false;
    this.doctorDialog = true;
  }

  deleteSelectedDoctors() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected doctors?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.doctors = this.doctors.filter(
          (val) => !this.selectedDoctors?.includes(val)
        );
        this.selectedDoctors = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Doctors Deleted',
          life: 3000,
        });
      },
    });
  }

  editDoctor(doctor: DoctorModel) {
    this.doctor = { ...doctor };

    this.selectedDepartment.value = doctor.departmentValue;

    this.doctorDialog = true;
  }

  deleteDoctor(doctor: DoctorModel) {
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

  hideDialog() {
    this.doctorDialog = false;
    this.submitted = false;
  }

  saveDoctor() {
    this.submitted = true;

    if (this.doctor.fullName?.trim()) {
      if (this.doctor.id) {
        this.doctors[this.findIndexById(this.doctor.id)] = this.doctor;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Doctor Updated',
          life: 3000,
        });
      } else {
        this.doctor.id = this.createId();
        this.doctors.push(this.doctor);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Doctor Created',
          life: 3000,
        });
      }

      this.doctors = [...this.doctors];
      this.doctorDialog = false;
      this.doctor = new DoctorModel();
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.doctors.length; i++) {
      if (this.doctors[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}