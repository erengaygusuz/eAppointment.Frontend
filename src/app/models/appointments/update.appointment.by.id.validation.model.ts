import { AppointmentStatus } from '../../enums/AppointmentStatus';

export class UpdateAppointmentByIdValidationModel {
  id: number = 0;
  fullName: string = '';
  startDate: string = '';
  endDate: string = '';
  status: AppointmentStatus = AppointmentStatus.NotCompleted;
}
