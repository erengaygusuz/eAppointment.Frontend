/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { UpdateAppointmentByIdValidationModel } from '../../../../models/appointments/update.appointment.by.id.validation.model';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { Severity } from '../../../../models/others/severity.model';
import { AppointmentStatus } from '../../../../enums/AppointmentStatus';

@Component({
  selector: 'app-update-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    TranslateModule
  ],
  templateUrl: './update-appointment-dialog.component.html',
  styleUrl: './update-appointment-dialog.component.css',
  providers: [MessageService]
})
export class UpdateAppointmentDialogComponent implements OnInit, OnDestroy {
  title: string = '';

  @Input() visibility: boolean = false;
  @Input() appointment = new UpdateAppointmentByIdValidationModel();
  @Input() validationControl: any;
  @Input() appointmentStatusList: AppointmentStatus[] = [];

  @Output() onSubmit = new EventEmitter();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();
  @Output() checkForValidation = new EventEmitter<{ propName: string }>();

  severityList: Severity[] = [];

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData(
          'Pages.Appointments.UpdateAppointmentDialog',
          'Enums.AppointmentStatus'
        );

        //this.formValidator.getTranslationData(this.translate);

        this.validationControl = {};
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTranslationData(...keys: string[]) {
    this.translate.get(keys).subscribe(data => {
      this.title = data['Pages.Appointments.UpdateAppointmentDialog'].Title;
    });
  }
}
