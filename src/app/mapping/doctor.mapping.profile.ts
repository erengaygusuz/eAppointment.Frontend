import { MappingPair, Profile } from '@dynamic-mapper/mapper';
import { Injectable } from '@angular/core';
import { CreateDoctorValidationModel } from '../models/doctors/create.doctor.validation.model';
import { CreateDoctorCommandModel } from '../models/doctors/create.doctor.command.model';
import { UpdateDoctorByIdCommandModel } from '../models/doctors/update.doctor.by.id.command.model';
import { UpdateDoctorByIdValidationModel } from '../models/doctors/update.doctor.by.id.validation.model';
import { GetDoctorByIdQueryResponseModel } from '../models/doctors/get.doctor.by.id.query.response.model';

@Injectable()
export class DoctorMappingProfile extends Profile {
  static readonly CreateDoctorValidationModelToCreateDoctorCommandModel =
    new MappingPair(CreateDoctorValidationModel, CreateDoctorCommandModel);

  static readonly UpdateDoctorByIdValidationModelToUpdateDoctorByIdCommandModel =
    new MappingPair(
      UpdateDoctorByIdValidationModel,
      UpdateDoctorByIdCommandModel
    );

  static readonly GetDoctorByIdQueryResponseModelToUpdateDoctorByIdValidationModel =
    new MappingPair(
      GetDoctorByIdQueryResponseModel,
      UpdateDoctorByIdValidationModel
    );

  constructor() {
    super();

    this.createMap(
      DoctorMappingProfile.CreateDoctorValidationModelToCreateDoctorCommandModel,
      {
        firstName: opt => {
          opt.mapFrom(src => src.firstName);
        },
        lastName: opt => {
          opt.mapFrom(src => src.lastName);
        },
        userName: opt => {
          opt.mapFrom(src => src.userName);
        },
        phoneNumber: opt => {
          opt.mapFrom(src => src.phoneNumber);
        },
        email: opt => {
          opt.mapFrom(src => src.email);
        },
        password: opt => {
          opt.mapFrom(src => src.password);
        },
        departmentId: opt => {
          opt.mapFrom(src => src.department.id);
        }
      }
    );

    this.createMap(
      DoctorMappingProfile.UpdateDoctorByIdValidationModelToUpdateDoctorByIdCommandModel,
      {
        firstName: opt => {
          opt.mapFrom(src => src.firstName);
        },
        lastName: opt => {
          opt.mapFrom(src => src.lastName);
        },
        userName: opt => {
          opt.mapFrom(src => src.userName);
        },
        phoneNumber: opt => {
          opt.mapFrom(src => src.phoneNumber);
        },
        email: opt => {
          opt.mapFrom(src => src.email);
        },
        departmentId: opt => {
          opt.mapFrom(src => src.department.id);
        }
      }
    );

    this.createMap(
      DoctorMappingProfile.GetDoctorByIdQueryResponseModelToUpdateDoctorByIdValidationModel,
      {
        firstName: opt => {
          opt.mapFrom(src => src.firstName);
        },
        lastName: opt => {
          opt.mapFrom(src => src.lastName);
        },
        userName: opt => {
          opt.mapFrom(src => src.userName);
        },
        phoneNumber: opt => {
          opt.mapFrom(src => src.phoneNumber);
        },
        email: opt => {
          opt.mapFrom(src => src.email);
        }
      }
    );
  }
}
