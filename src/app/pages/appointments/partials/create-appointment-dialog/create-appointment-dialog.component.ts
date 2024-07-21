import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CreateAppointmentCommandModel } from '../../../../models/appointments/create.appointment.command.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'app-create-appointment-dialog',
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
    TranslateModule
  ],
  templateUrl: './create-appointment-dialog.component.html',
  styleUrl: './create-appointment-dialog.component.css'
})
export class CreateAppointmentDialogComponent implements OnInit, OnDestroy {
  title: string = '';

  appointmentForm: FormGroup;

  @Input() visibility: boolean = false;
  @Input() appointment = new CreateAppointmentCommandModel();

  @Output() saveAppointment = new EventEmitter<{ form: FormGroup }>();
  @Output() changeVisibility = new EventEmitter<{ visibility: boolean }>();

  isFormSubmitted: boolean = false;

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  onSubmit() {
    this.isFormSubmitted = true;

    this.saveAppointment.emit({ form: this.appointmentForm });
  }

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.appointmentForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData(
          'Pages.CreateAppointment.CreateAppointmentDialog'
        );
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTranslationData(key: string) {
    this.translate.get(key).subscribe(data => {
      this.title = data.Title;
    });
  }
}
