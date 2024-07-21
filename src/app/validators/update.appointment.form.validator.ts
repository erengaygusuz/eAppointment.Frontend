import { Validator } from 'fluentvalidation-ts';
import { TranslateService } from '@ngx-translate/core';
import { UpdateAppointmentByIdValidationModel } from '../models/appointments/update.appointment.by.id.validation.model';

export class UpdateAppointmentFormValidator extends Validator<UpdateAppointmentByIdValidationModel> {
  constructor() {
    super();
  }

  getTranslationData(translate: TranslateService) {
    translate
      .get('Pages.Appointments.UpdateAppointmentDialog.Form.Controls')
      .subscribe(data => {
        this.generateRules(data);
      });
  }

  generateRules(data: any) {
    this.ruleFor('status')
      .must(status => status.getConvertedValue() > 0)
      .withMessage(data.Status.ValidationMessages.NotSelect);
  }
}
