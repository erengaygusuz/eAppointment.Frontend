import { MappingPair, Profile } from '@dynamic-mapper/mapper';
import { Injectable } from '@angular/core';
import { CreateAdminCommandModel } from '../models/admins/create.admin.command.model';
import { CreateAdminValidationModel } from '../models/admins/create.admin.validation.model';
import { UpdateAdminByIdValidationModel } from '../models/admins/update.admin.by.id.validation.model';
import { UpdateAdminByIdCommandModel } from '../models/admins/update.admin.by.id.command.model';
import { GetAdminByIdQueryResponseModel } from '../models/admins/get.admin.by.id.query.response.model';
import { UpdateAdminProfileByIdValidationModel } from '../models/admins/update.admin.profile.by.id.validation.model';
import { UpdateAdminProfileByIdCommandModel } from '../models/admins/update.admin.profile.by.id.command.model';
import { GetAdminProfileByIdQueryResponseModel } from '../models/admins/get.admin.profile.by.id.query.response.model';

@Injectable()
export class AdminMappingProfile extends Profile {
  static readonly CreateAdminValidationModelToCreateAdminCommandModel =
    new MappingPair(CreateAdminValidationModel, CreateAdminCommandModel);

  static readonly UpdateAdminByIdValidationModelToUpdateAdminByIdCommandModel =
    new MappingPair(
      UpdateAdminByIdValidationModel,
      UpdateAdminByIdCommandModel
    );

  static readonly UpdateAdminProfileByIdValidationModelToUpdateAdminProfileByIdCommandModel =
    new MappingPair(
      UpdateAdminProfileByIdValidationModel,
      UpdateAdminProfileByIdCommandModel
    );

  static readonly GetAdminByIdQueryResponseModelToUpdateAdminByIdValidationModel =
    new MappingPair(
      GetAdminByIdQueryResponseModel,
      UpdateAdminByIdValidationModel
    );

  static readonly GetAdminProfileByIdQueryResponseModelToUpdateAdminProfileByIdValidationModel =
    new MappingPair(
      GetAdminProfileByIdQueryResponseModel,
      UpdateAdminProfileByIdValidationModel
    );

  constructor() {
    super();

    this.createMap(
      AdminMappingProfile.CreateAdminValidationModelToCreateAdminCommandModel,
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
        }
      }
    );

    this.createMap(
      AdminMappingProfile.UpdateAdminByIdValidationModelToUpdateAdminByIdCommandModel,
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
      AdminMappingProfile.UpdateAdminProfileByIdValidationModelToUpdateAdminProfileByIdCommandModel,
      {
        firstName: opt => {
          opt.mapFrom(src => src.firstName);
        },
        lastName: opt => {
          opt.mapFrom(src => src.lastName);
        },
        phoneNumber: opt => {
          opt.mapFrom(src => src.phoneNumber);
        },
        profilePhotoPath: opt => {
          opt.mapFrom(src => src.profilePhotoPath);
        }
      }
    );

    this.createMap(
      AdminMappingProfile.GetAdminByIdQueryResponseModelToUpdateAdminByIdValidationModel,
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
      AdminMappingProfile.GetAdminProfileByIdQueryResponseModelToUpdateAdminProfileByIdValidationModel,
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
        profilePhotoPath: opt => {
          opt.mapFrom(src => src.profilePhotoPath);
        }
      }
    );
  }
}
