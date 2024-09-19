import { Validator } from 'fluentvalidation-ts';
import { LoginValidationModel } from '../models/auth/login.validation.model';
import { TranslateService } from '@ngx-translate/core';

export class LoginFormValidator extends Validator<LoginValidationModel> {
  constructor() {
    super();
  }

  getTranslationData(translate: TranslateService) {
    translate.get('Pages.Login.Form.Controls').subscribe(data => {
      this.generateRules(data);
    });
  }

  generateRules(data: any) {
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

    this.ruleFor('password')
      .notEmpty()
      .withMessage(data.Password.ValidationMessages.NotEmpty)
      .minLength(1)
      .withMessage(data.Password.ValidationMessages.MinLength)
      .maxLength(5)
      .withMessage(data.Password.ValidationMessages.MaxLength);
  }
}
