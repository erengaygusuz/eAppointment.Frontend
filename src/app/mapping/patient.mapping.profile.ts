import { MappingPair, Profile } from '@dynamic-mapper/mapper';
import { Injectable } from '@angular/core';
import { CreatePatientValidationModel } from '../models/patients/create.patient.validation.model';
import { CreatePatientCommandModel } from '../models/patients/create.patient.command.model';
import { UpdatePatientByIdCommandModel } from '../models/patients/update.patient.by.id.command.model';
import { UpdatePatientByIdValidationModel } from '../models/patients/update.patient.by.id.validation.model';
import { GetPatientByIdQueryResponseModel } from '../models/patients/get.patient.by.id.query.response.model';
import { UpdatePatientProfileByIdValidationModel } from '../models/patients/update.patient.profile.by.id.validation.model';
import { UpdatePatientProfileByIdCommandModel } from '../models/patients/update.patient.profile.by.id.command.model';
import { GetPatientProfileByIdQueryResponseModel } from '../models/patients/get.patient.profile.by.id.query.response.model';

@Injectable()
export class PatientMappingProfile extends Profile {
  static readonly CreatePatientValidationModelToCreatePatientCommandModel =
    new MappingPair(CreatePatientValidationModel, CreatePatientCommandModel);

  static readonly UpdatePatientByIdValidationModelToUpdatePatientByIdCommandModel =
    new MappingPair(
      UpdatePatientByIdValidationModel,
      UpdatePatientByIdCommandModel
    );

  static readonly UpdatePatientProfileByIdValidationModelToUpdatePatientProfileByIdCommandModel =
    new MappingPair(
      UpdatePatientProfileByIdValidationModel,
      UpdatePatientProfileByIdCommandModel
    );

  static readonly GetPatientByIdQueryResponseModelToUpdatePatientByIdValidationModel =
    new MappingPair(
      GetPatientByIdQueryResponseModel,
      UpdatePatientByIdValidationModel
    );

  static readonly GetPatientProfileByIdQueryResponseModelToUpdatePatientProfileByIdValidationModel =
    new MappingPair(
      GetPatientProfileByIdQueryResponseModel,
      UpdatePatientProfileByIdValidationModel
    );

  constructor() {
    super();

    this.createMap(
      PatientMappingProfile.CreatePatientValidationModelToCreatePatientCommandModel,
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
        identityNumber: opt => {
          opt.mapFrom(src => src.identityNumber);
        },
        password: opt => {
          opt.mapFrom(src => src.password);
        },
        countyId: opt => {
          opt.mapFrom(src => src.county.id);
        },
        fullAddress: opt => {
          opt.mapFrom(src => src.fullAddress);
        }
      }
    );

    this.createMap(
      PatientMappingProfile.UpdatePatientByIdValidationModelToUpdatePatientByIdCommandModel,
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
        identityNumber: opt => {
          opt.mapFrom(src => src.identityNumber);
        },
        email: opt => {
          opt.mapFrom(src => src.email);
        },
        countyId: opt => {
          opt.mapFrom(src => src.county.id);
        },
        fullAddress: opt => {
          opt.mapFrom(src => src.fullAddress);
        }
      }
    );

    this.createMap(
      PatientMappingProfile.UpdatePatientProfileByIdValidationModelToUpdatePatientProfileByIdCommandModel,
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
        countyId: opt => {
          opt.mapFrom(src => src.county.id.toString());
        },
        fullAddress: opt => {
          opt.mapFrom(src => src.fullAddress);
        }
      }
    );

    this.createMap(
      PatientMappingProfile.GetPatientByIdQueryResponseModelToUpdatePatientByIdValidationModel,
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
        identityNumber: opt => {
          opt.mapFrom(src => src.identityNumber);
        },
        fullAddress: opt => {
          opt.mapFrom(src => src.fullAddress);
        }
      }
    );

    this.createMap(
      PatientMappingProfile.GetPatientProfileByIdQueryResponseModelToUpdatePatientProfileByIdValidationModel,
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
        identityNumber: opt => {
          opt.mapFrom(src => src.identityNumber);
        },
        fullAddress: opt => {
          opt.mapFrom(src => src.fullAddress);
        }
      }
    );
  }
}
