import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { GetUserByIdQueryResponse } from '../../../models/users/get.user.by.id.query.response.model';
import { GetAllRolesQueryResponseModel } from '../../../models/roles/get.all.roles.query.response.model';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { GetAllDepartmentsQueryResponseModel } from '../../../models/departments/get.all.departments.query.response.model';
import { GetAllCitiesQueryResponseModel } from '../../../models/cities/get.all.cities.query.response.model';
import { GetAllCountiesByCityIdQueryResponseModel } from '../../../models/counties/get.all.counties.by.city.id.query.response.model';

@Component({
  selector: 'app-user-add-or-edit',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    InputMaskModule
  ],
  templateUrl: './user-add-or-edit.component.html',
  styleUrl: './user-add-or-edit.component.css',
  providers: [MessageService, ConfirmationService]
})
export class UserAddOrEditComponent implements OnInit {
  @Output() saveUser = new EventEmitter<{ form: FormGroup }>();

  user: GetUserByIdQueryResponse = new GetUserByIdQueryResponse();

  userRoles: GetAllRolesQueryResponseModel[] = [];
  selectedUserRole: GetAllRolesQueryResponseModel =
    new GetAllRolesQueryResponseModel();

  departments: GetAllDepartmentsQueryResponseModel[] = [];
  selectedDepartment: GetAllDepartmentsQueryResponseModel =
    new GetAllDepartmentsQueryResponseModel();

  cities: GetAllCitiesQueryResponseModel[] = [];
  selectedCity: GetAllCitiesQueryResponseModel =
    new GetAllCitiesQueryResponseModel();

  counties: GetAllCountiesByCityIdQueryResponseModel[] = [];

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  userForm: FormGroup;

  isFormSubmitted: boolean = false;

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
  ) {
    this.userForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      role: new FormControl(0, [Validators.pattern('[^0]+')]),
      department: new FormControl(0, [Validators.pattern('[^0]+')])
    });
  }

  ngOnInit(): void {
    this.items = [{ label: 'Users' }];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };

    const id = this.route.snapshot.paramMap.get('id');

    this.getUserById(id!);
  }

  getAllUserRoles(user: GetUserByIdQueryResponse) {
    this.http.post<GetAllRolesQueryResponseModel[]>('roles/getall', {}, res => {
      this.userRoles = res.data;

      this.selectedUserRole = this.userRoles.filter(
        x => x.id == user.roleId
      )[0];
    });
  }

  getUserById(id: string) {
    this.http.post<GetUserByIdQueryResponse[]>(
      'users/getbyid',
      { id: id },
      res => {
        this.user = new GetUserByIdQueryResponse();

        this.user = res.data;

        this.getAllUserRoles(this.user);
      }
    );
  }

  getAllDepartments() {
    this.http.post<GetAllDepartmentsQueryResponseModel[]>(
      'departments/getall',
      {},
      res => {
        this.departments = res.data;
      }
    );
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

  getAllCountiesByCityId(cityId: string) {
    this.http.post<GetAllCountiesByCityIdQueryResponseModel[]>(
      'counties/getall',
      { cityId: cityId },
      res => {
        this.counties = res.data;
      }
    );
  }

  onSubmit() {
    this.isFormSubmitted = true;

    this.saveUser.emit({ form: this.userForm });
  }
}
