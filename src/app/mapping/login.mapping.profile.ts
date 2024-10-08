import { MappingPair, Profile } from '@dynamic-mapper/mapper';
import { Injectable } from '@angular/core';
import { LoginValidationModel } from '../models/auth/login.validation.model';
import { LoginCommandModel } from '../models/auth/login.command.model';

@Injectable()
export class LoginMappingProfile extends Profile {
  static readonly LoginValidationModelToLoginCommandModel = new MappingPair(
    LoginValidationModel,
    LoginCommandModel
  );

  constructor() {
    super();

    this.createMap(
      LoginMappingProfile.LoginValidationModelToLoginCommandModel,
      {
        userName: opt => {
          opt.mapFrom(src => src.userName);
        },
        password: opt => {
          opt.mapFrom(src => src.password);
        }
      }
    );
  }
}
