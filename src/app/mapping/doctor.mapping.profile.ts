import { MappingPair, Profile } from '@dynamic-mapper/mapper';
import { DepartmentModel, DoctorModel } from '../models/doctor.model';
import { DoctorDto } from '../dtos/doctor.dto';
import { departments } from '../constants';

export class DoctorMappingProfile extends Profile {
  static readonly DomainToDto = new MappingPair(DoctorModel, DoctorDto);
  static readonly DtoToDomain = new MappingPair(DoctorDto, DoctorModel);

  departments = departments;

  constructor() {
    super();

    this.createMap(DoctorMappingProfile.DomainToDto, {
      id: opt => {
        opt.mapFrom(src => src.id);
      },
      departmentName: opt => {
        opt.mapFrom(src => src.department.name);
      },
      fullName: opt => {
        opt.mapFrom(src => src.fullName);
      }
    });

    this.createMap(DoctorMappingProfile.DtoToDomain, {
      id: opt => {
        opt.mapFrom(src => src.id);
      },
      firstName: opt => {
        opt.mapFrom(src => src.fullName.split(' ')[0]);
      },
      lastName: opt => {
        opt.mapFrom(src => src.fullName.split(' ')[1]);
      },
      fullName: opt => {
        opt.mapFrom(src => src.fullName);
      },
      department: opt => {
        opt.mapFrom(src => this.getDepartment(src.departmentName));
      }
    });
  }

  getDepartment(departmentName: string): DepartmentModel{

    let department = departments.find(x => x.name == departmentName)

    if(department){
      return department;
    }else{
      return new DepartmentModel();
    }
  }
}