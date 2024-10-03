import { ClassEnum } from 'class-enum';

export class Role extends ClassEnum<Role> {
  public static readonly SuperAdmin = new Role('SuperAdmin', 1, 'success');
  public static readonly Admin = new Role('Admin', 2, 'warning');
  public static readonly Doctor = new Role('Doctor', 3, 'secondary');
  public static readonly Patient = new Role('Patient', 4, 'danger');

  private readonly convertedValue!: number;
  private readonly color!: string;

  public constructor(value: string, convertedValue: number, color: string) {
    super(value);

    this.convertedValue = convertedValue;
    this.color = color;
  }

  public getConvertedValue() {
    return this.convertedValue;
  }

  public getColor() {
    return this.color;
  }
}
