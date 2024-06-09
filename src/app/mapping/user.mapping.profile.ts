import { MappingPair, Profile } from '@dynamic-mapper/mapper';
import { UserModel } from '../models/user.model';
import { UserDto } from '../dtos/user.dto';
import { RoleModel } from '../models/role.model';
import { HttpService } from '../services/http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserMappingProfile extends Profile {
  static readonly DomainToDto = new MappingPair(UserModel, UserDto);
  static readonly DtoToDomain = new MappingPair(UserDto, UserModel);

  userRoles: RoleModel[] = [];

  constructor(private http: HttpService) {
    super();

    this.createMap(UserMappingProfile.DomainToDto, {
      id: (opt) => {
        opt.mapFrom((src) => src.id);
      },
      fullName: (opt) => {
        opt.mapFrom((src) => src.fullName);
      },
      username: (opt) => {
        opt.mapFrom((src) => src.userName);
      },
      email: (opt) => {
        opt.mapFrom((src) => src.email);
      },
      roles: (opt) => {
        opt.mapFrom((src) => src.roles.map(role => { return role.name } ));
      },
    });

    this.createMap(UserMappingProfile.DtoToDomain, {
      id: (opt) => {
        opt.mapFrom((src) => src.id);
      },
      firstName: (opt) => {
        opt.mapFrom((src) => src.fullName.split(' ')[0]);
      },
      lastName: (opt) => {
        opt.mapFrom((src) => src.fullName.split(' ')[1]);
      },
      fullName: (opt) => {
        opt.mapFrom((src) => src.fullName);
      },
      userName: (opt) => {
        opt.mapFrom((src) => src.username);
      },
      email: (opt) => {
        opt.mapFrom((src) => src.email);
      },
      password: (opt) => {
        opt.mapFrom((src) => this.getUserPassword(src.username));
      },
      roles: (opt) => {
        opt.mapFrom((src) => { 

          this.getUserRoles(src.id);

          return this.userRoles;

        });
      },
    });
  }

  getUserPassword(username: string){

    return "";
  }

  getUserRoles(id: string){

    this.http.post<RoleModel[]>("users/getallrolesbyusername", {id: id}, res => {

      this.userRoles = res.data;

    });
  }
}
