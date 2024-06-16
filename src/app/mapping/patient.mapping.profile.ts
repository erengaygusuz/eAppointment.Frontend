import { MappingPair, Profile } from '@dynamic-mapper/mapper';
import { PatientModel } from '../models/patient.model';
import { PatientDto } from '../dtos/patient.dto';
import { Injectable } from '@angular/core';

@Injectable()
export class PatientMappingProfile extends Profile {
  static readonly DomainToDto = new MappingPair(PatientModel, PatientDto);
  static readonly DtoToDomain = new MappingPair(PatientDto, PatientModel);

  constructor() {
    super();

    this.createMap(PatientMappingProfile.DomainToDto, {
      id: (opt) => {
        opt.mapFrom((src) => src.id);
      },
      fullName: (opt) => {
        opt.mapFrom((src) => src.fullName);
      },
      identityNumber: (opt) => {
        opt.mapFrom((src) => src.identityNumber);
      },
      city: (opt) => {
        opt.mapFrom((src) => src.city);
      },
      town: (opt) => {
        opt.mapFrom((src) => src.town);
      },
      fullAddress: (opt) => {
        opt.mapFrom((src) => src.fullAddress);
      },
    });

    this.createMap(PatientMappingProfile.DtoToDomain, {
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
      city: (opt) => {
        opt.mapFrom((src) => src.city);
      },
      town: (opt) => {
        opt.mapFrom((src) => src.town);
      },
      fullAddress: (opt) => {
        opt.mapFrom((src) => src.fullAddress);
      },
      identityNumber: (opt) => {
        opt.mapFrom((src) => src.identityNumber);
      },
    });
  }
}
