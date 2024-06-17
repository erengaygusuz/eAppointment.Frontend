export class CreateAppointmentModel {
  id: string = '';
  startDate: string = '';
  endDate: string = '';
  doctorId: string = '';
  patientId: string | null = null;
  firstName: string = '';
  lastName: string = '';
  identityNumber: string = '';
  city: string = '';
  town: string = '';
  fullAddress: string = '';
}
