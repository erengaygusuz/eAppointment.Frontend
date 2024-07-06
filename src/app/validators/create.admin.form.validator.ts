import { Validator } from 'fluentvalidation-ts';
import { CreateAdminValidationModel } from '../models/admins/create.admin.validation.model';

export class CreateAdminFormValidator extends Validator<CreateAdminValidationModel> {
  constructor() {
    super();

    this.ruleFor('firstName')
      .notEmpty()
      .withMessage('Please fill firstname')
      .minLength(3)
      .withMessage('Please enter minimum 3 characters for firstname')
      .maxLength(50)
      .withMessage('Please enter maximum 50 characters for firstname')
      .matches(new RegExp('^((?![0-9]).)*$'))
      .withMessage('Please do not use numbers in your firstname');

    this.ruleFor('lastName')
      .notEmpty()
      .withMessage('Please fill lastname')
      .minLength(3)
      .withMessage('Please enter minimum 3 characters for lastname')
      .maxLength(50)
      .withMessage('Please enter maximum 50 characters for lastname')
      .matches(new RegExp('^((?![0-9]).)*$'))
      .withMessage('Please do not use numbers in your lastname');

    this.ruleFor('userName')
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

    this.ruleFor('phoneNumber')
      .notEmpty()
      .withMessage('Please fill phone number')
      .matches(new RegExp('((\\(\\d{3}\\) ?)|(\\d{3}-)) ?\\d{3}-\\d{4}'))
      .withMessage('Please enter a valid phone number')
      .matches(new RegExp('^((?![a-zA-Z]).)*$'))
      .withMessage('Please do not use letters in your phone number');

    this.ruleFor('email')
      .notEmpty()
      .withMessage('Please fill email')
      .emailAddress()
      .withMessage('Please enter a valid email')
      .maxLength(150)
      .withMessage('Please enter maximum 150 characters for email');

    this.ruleFor('password')
      .notEmpty()
      .withMessage('Please fill password')
      .minLength(1)
      .withMessage('Please enter minimum 1 characters for password')
      .maxLength(5)
      .withMessage('Please enter maximum 5 characters for password');

    this.ruleFor('passwordAgain')
      .notEmpty()
      .withMessage('Please fill password again')
      .must((passwordAgain, model) => passwordAgain === model.password)
      .withMessage('Password does not match');
  }
}
