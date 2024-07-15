import { Validator } from 'fluentvalidation-ts';
import { UpdateAdminByIdValidationModel } from '../models/admins/update.admin.by.id.validation.model';
import { TranslateService } from '@ngx-translate/core';

export class UpdateAdminFormValidator extends Validator<UpdateAdminByIdValidationModel> {
  constructor() {
    super();
  }

  getTranslationData(translate: TranslateService) {
    translate.get('Pages.UpdateDoctor.Form.Controls').subscribe(data => {
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

    this.ruleFor('userName')
      .notEmpty()
      .withMessage(data.Username.ValidationMessages.NotEmpty)
      .minLength(3)
      .withMessage(data.Username.ValidationMessages.MinLength)
      .maxLength(100)
      .withMessage(data.Username.ValidationMessages.MaxLength)
      .matches(new RegExp('^((?![ ]).)*$'))
      .withMessage(data.Username.ValidationMessages.NotUseSpaces)
      .matches(new RegExp('^((?![ğĞçÇşŞüÜöÖıİ]).)*$'))
      .withMessage(data.Username.ValidationMessages.NotUseTurkishCharacters)
      .matches(new RegExp('^((?![A-Z]).)*$'))
      .withMessage(data.Username.ValidationMessages.NotUseUpperLetters)
      .matches(new RegExp('^((?![0-9]).)*$'))
      .withMessage(data.Username.ValidationMessages.NotUseNumbers);

    this.ruleFor('phoneNumber')
      .notEmpty()
      .withMessage(data.PhoneNumber.ValidationMessages.NotEmpty)
      .matches(new RegExp('((\\(\\d{3}\\) ?)|(\\d{3}-)) ?\\d{3}-\\d{4}'))
      .withMessage(data.PhoneNumber.ValidationMessages.NotValid)
      .matches(new RegExp('^((?![a-zA-Z]).)*$'))
      .withMessage(data.PhoneNumber.ValidationMessages.NotUseLetters);

    this.ruleFor('email')
      .notEmpty()
      .withMessage(data.Email.ValidationMessages.NotEmpty)
      .emailAddress()
      .withMessage(data.Email.ValidationMessages.NotValid)
      .maxLength(150)
      .withMessage(data.Email.ValidationMessages.MaxLength);
  }
}
