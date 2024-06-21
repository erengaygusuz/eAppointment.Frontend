export class GetAllPatientsByDoctorIdQueryResponseModel {
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  identityNumber: string = '';
  patientAppointments: PatientAppointmentModel[] = [];
}

export class PatientAppointmentModel {
  id: string = '';
  startDate: string = '';
  endDate: string = '';
  status: number = 0;
}
