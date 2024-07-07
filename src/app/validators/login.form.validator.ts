import { Validator } from 'fluentvalidation-ts';
import { LoginValidationModel } from '../models/auth/login.validation.model';

export class LoginFormValidator extends Validator<LoginValidationModel> {
  constructor() {
    super();

    this.ruleFor('userNameOrEmail')
      .notEmpty()
      .withMessage('Please fill username')
      .minLength(3)
      .withMessage('Please enter minimum 3 characters for username')
      .maxLength(100)
      .withMessage('Please enter maximum 100 characters for username')
      .matches(new RegExp('^((?![ ]).)*$'))
      .withMessage('Please do not use spaces in your username')
      .matches(new RegExp('^((?![ğĞçÇşŞüÜöÖıİ]).)*$'))
      .withMessage('Please do not use turkish letters in your username')
      .matches(new RegExp('^((?![A-Z]).)*$'))
      .withMessage('Please do not use upper case letters in your username')
      .matches(new RegExp('^((?![0-9]).)*$'))
      .withMessage('Please do not use numbers in your username');

    this.ruleFor('password')
      .notEmpty()
      .withMessage('Please fill password')
      .minLength(1)
      .withMessage('Please enter minimum 1 characters for password')
      .maxLength(5)
      .withMessage('Please enter maximum 5 characters for password');
  }
}
