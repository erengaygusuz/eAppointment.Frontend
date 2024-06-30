import { Validator } from 'fluentvalidation-ts';
import { CreatePatientCommandModel } from '../models/patients/create.patient.command.model';

export class CreatePatientFormValidator extends Validator<CreatePatientCommandModel> {
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
      // .matches(new RegExp(''))
      // .withMessage('Please enter a valid phone number')
      .matches(new RegExp('^((?![a-zA-Z]).)*$'))
      .withMessage('Please do not use letters in your phone number');

    this.ruleFor('email')
      .notEmpty()
      .withMessage('Please fill email')
      .emailAddress()
      .withMessage('Please enter a valid email')
      .maxLength(150)
      .withMessage('Please enter maximum 150 characters for email');

    this.ruleFor('identityNumber')
      .notEmpty()
      .withMessage('Please fill identity number')
      .must(identityNumber => identityNumber.length == 11)
      .withMessage('Please enter 11 number for identity number')
      .matches(new RegExp('^((?![a-zA-Z]).)*$'))
      .withMessage('Please do not use letters in your identity number');

    this.ruleFor('password').notEmpty().withMessage('Please fill password');

    this.ruleFor('countyId')
      .must(countyId => countyId > 0)
      .withMessage('Please choose a county');

    this.ruleFor('fullAddress')
      .notEmpty()
      .withMessage('Please fill full address')
      .minLength(50)
      .withMessage('Please enter minimum 50 characters for full address')
      .maxLength(500)
      .withMessage('Please enter maximum 500 characters for full address');
  }
}
