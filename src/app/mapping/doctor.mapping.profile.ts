import { MappingPair, Profile } from '@dynamic-mapper/mapper';
import { Injectable } from '@angular/core';
import { CreateDoctorValidationModel } from '../models/doctors/create.doctor.validation.model';
import { CreateDoctorCommandModel } from '../models/doctors/create.doctor.command.model';
import { UpdateDoctorByIdCommandModel } from '../models/doctors/update.doctor.by.id.command.model';
import { UpdateDoctorByIdValidationModel } from '../models/doctors/update.doctor.by.id.validation.model';
import { GetDoctorByIdQueryResponseModel } from '../models/doctors/get.doctor.by.id.query.response.model';
import { UpdateDoctorProfileByIdValidationModel } from '../models/doctors/update.doctor.profile.by.id.validation.model';
import { UpdateDoctorProfileByIdCommandModel } from '../models/doctors/update.doctor.profile.by.id.command.model';
import { GetDoctorProfileByIdQueryResponseModel } from '../models/doctors/get.doctor.profile.by.id.query.response.model';

@Injectable()
export class DoctorMappingProfile extends Profile {
  static readonly CreateDoctorValidationModelToCreateDoctorCommandModel =
    new MappingPair(CreateDoctorValidationModel, CreateDoctorCommandModel);

  static readonly UpdateDoctorByIdValidationModelToUpdateDoctorByIdCommandModel =
    new MappingPair(
      UpdateDoctorByIdValidationModel,
      UpdateDoctorByIdCommandModel
    );

  static readonly UpdateDoctorProfileByIdValidationModelToUpdateDoctorProfileByIdCommandModel =
    new MappingPair(
      UpdateDoctorProfileByIdValidationModel,
      UpdateDoctorProfileByIdCommandModel
    );

  static readonly GetDoctorByIdQueryResponseModelToUpdateDoctorByIdValidationModel =
    new MappingPair(
      GetDoctorByIdQueryResponseModel,
      UpdateDoctorByIdValidationModel
    );

  static readonly GetDoctorProfileByIdQueryResponseModelToUpdateDoctorProfileByIdValidationModel =
    new MappingPair(
      GetDoctorProfileByIdQueryResponseModel,
      UpdateDoctorProfileByIdValidationModel
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
      DoctorMappingProfile.UpdateDoctorProfileByIdValidationModelToUpdateDoctorProfileByIdCommandModel,
      {
        firstName: opt => {
          opt.mapFrom(src => src.firstName);
        },
        lastName: opt => {
          opt.mapFrom(src => src.lastName);
        },
        phoneNumber: opt => {
          opt.mapFrom(src => src.phoneNumber);
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

    this.createMap(
      DoctorMappingProfile.GetDoctorProfileByIdQueryResponseModelToUpdateDoctorProfileByIdValidationModel,
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
