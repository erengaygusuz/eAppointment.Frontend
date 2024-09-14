import { Validator } from 'fluentvalidation-ts';
import { TranslateService } from '@ngx-translate/core';
import { UpdateAdminProfileByIdValidationModel } from '../models/admins/update.admin.profile.by.id.validation.model';

export class UpdateAdminProfileFormValidator extends Validator<UpdateAdminProfileByIdValidationModel> {
  constructor() {
    super();
  }

  getTranslationData(translate: TranslateService) {
    translate.get('Pages.UpdateAdminProfile.Form.Controls').subscribe(data => {
      this.generateRules(data);
    });
  }

  generateRules(data: any) {
    this.ruleFor('firstName')
      .notEmpty()
      .withMessage(data.Firstname.ValidationMessages.NotEmpty)
      .minLength(3)
      .withMessage(data.Firstname.ValidationMessages.MinLength)
      .maxLength(50)
      .withMessage(data.Firstname.ValidationMessages.MaxLength)
      .matches(new RegExp('^((?![0-9]).)*$'))
      .withMessage(data.Firstname.ValidationMessages.NotUseNumbers);

    this.ruleFor('lastName')
      .notEmpty()
      .withMessage(data.Lastname.ValidationMessages.NotEmpty)
      .minLength(3)
      .withMessage(data.Lastname.ValidationMessages.MinLength)
      .maxLength(50)
      .withMessage(data.Lastname.ValidationMessages.MaxLength)
      .matches(new RegExp('^((?![0-9]).)*$'))
      .withMessage(data.Lastname.ValidationMessages.NotUseNumbers);

    this.ruleFor('phoneNumber')
      .notEmpty()
      .withMessage(data.PhoneNumber.ValidationMessages.NotEmpty)
      .matches(new RegExp('((\\(\\d{3}\\) ?)|(\\d{3}-)) ?\\d{3}-\\d{4}'))
      .withMessage(data.PhoneNumber.ValidationMessages.NotValid)
      .matches(new RegExp('^((?![a-zA-Z]).)*$'))
      .withMessage(data.PhoneNumber.ValidationMessages.NotUseLetters);
  }
}
