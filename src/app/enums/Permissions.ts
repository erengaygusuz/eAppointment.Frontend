export const enum PERMISSIONS {
  CREATE_ADMIN = 'Permissions.Admins.CreateAdmin',
  GET_ADMIN_BY_ID = 'Permissions.Admins.GetAdminById',
  UPDATE_ADMIN_BY_ID = 'Permissions.Admins.UpdateAdminById',
  UPDATE_ADMIN_PROFILE_BY_ID = 'Permissions.Admins.UpdateAdminProfileById',

  CREATE_DOCTOR = 'Permissions.Doctors.CreateDoctor',
  GET_DOCTOR_BY_ID = 'Permissions.Doctors.GetDoctorById',
  UPDATE_DOCTOR_BY_ID = 'Permissions.Doctors.UpdateDoctorById',
  GET_ALL_DOCTORS_BY_DEPARTMENT_ID = 'Permissions.Doctors.GetAllDoctorsByDepartmentId',
  UPDATE_DOCTOR_PROFILE_BY_ID = 'Permissions.Doctors.UpdateDoctorProfileById',

  CREATE_PATIENT = 'Permissions.Patients.CreatePatient',
  GET_PATIENT_BY_ID = 'Permissions.Patients.GetPatientById',
  GET_ALL_PATIENTS_BY_DOCTOR_ID = 'Permissions.Patients.GetAllPatientsByDoctorId',
  UPDATE_PATIENT_BY_ID = 'Permissions.Patients.UpdatePatientById',
  UPDATE_PATIENT_PROFILE_BY_ID = 'Permissions.Patients.UpdatePatientProfileById',

  GET_ALL_ROLES = 'Permissions.Roles.GetAllRoles',

  GET_ALL_USERS = 'Permissions.Users.GetAllUsers',
  DELETE_USER_BY_ID = 'Permissions.Users.DeleteUserById',

  GET_ALL_CITIES = 'Permissions.Cities.GetAllCities',

  GET_ALL_COUNTIES_BY_CITY_ID = 'Permissions.Counties.GetAllCountiesByCityId',

  GET_ALL_DEPARTMENTS = 'Permissions.Departments.GetAllDepartments',

  GET_ALL_APPOINTMENTS_BY_DOCTOR_ID = 'Permissions.Appointments.GetAllAppointmentsByDoctorId',
  UPDATE_APPOINTMENT_STATUS_BY_ID = 'Permissions.Appointments.UpdateAppointmentStatusById',
  CREATE_APPOINTMENT = 'Permissions.Appointments.CreateAppointment',
  CANCEL_APPOINTMENT_BY_ID = 'Permissions.Appointments.CancelAppointmentById',
  GET_ALL_APPOINTMENTS_BY_PATIENT_ID = 'Permissions.Appointments.GetAllAppointmentsByPatientId',
  UPDATE_APPOINTMENT_BY_ID = 'Permissions.Appointments.UpdateAppointmentById',
}
