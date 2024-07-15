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
    this.ruleFor('userNameOrEmail')
      .notEmpty()
      .withMessage(data.UsernameOrEmail.ValidationMessages.NotEmpty)
      .minLength(3)
      .withMessage(data.UsernameOrEmail.ValidationMessages.MinLength)
      .maxLength(100)
      .withMessage(data.UsernameOrEmail.ValidationMessages.MaxLength)
      .matches(new RegExp('^((?![ ]).)*$'))
      .withMessage(data.UsernameOrEmail.ValidationMessages.NotUseSpaces)
      .matches(new RegExp('^((?![ğĞçÇşŞüÜöÖıİ]).)*$'))
      .withMessage(
        data.UsernameOrEmail.ValidationMessages.NotUseTurkishCharacters
      )
      .matches(new RegExp('^((?![A-Z]).)*$'))
      .withMessage(data.UsernameOrEmail.ValidationMessages.NotUseUpperLetters)
      .matches(new RegExp('^((?![0-9]).)*$'))
      .withMessage(data.UsernameOrEmail.ValidationMessages.NotUseNumbers);

    this.ruleFor('password')
      .notEmpty()
      .withMessage(data.Password.ValidationMessages.NotEmpty)
      .minLength(1)
      .withMessage(data.Password.ValidationMessages.MinLength)
      .maxLength(5)
      .withMessage(data.Password.ValidationMessages.MaxLength);
  }
}
