import { ClassEnum } from 'class-enum';

export class AppointmentStatus extends ClassEnum<AppointmentStatus> {
  public static readonly SuccessfullyCompleted = new AppointmentStatus(
    'SuccessfullyCompleted',
    1,
    'success'
  );
  public static readonly NotAttended = new AppointmentStatus(
    'NotAttended',
    2,
    'warning'
  );
  public static readonly Cancelled = new AppointmentStatus(
    'Cancelled',
    3,
    'danger'
  );
  public static readonly NotCompleted = new AppointmentStatus(
    'NotCompleted',
    4,
    'secondary'
  );

  private readonly convertedValue!: number;
  private readonly color!: string;
  private readonly translatedText!: string;

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
