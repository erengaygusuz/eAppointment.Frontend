import { ErrorHandler, Injectable, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler, OnDestroy {
  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleError(error: any): void {
    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData(
          'Error.Message',
          'Components.Toast.Error.Summary'
        );
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTranslationData(...keys: string[]) {
    this.translate.get(keys).subscribe(data => {
      this.messageService.add({
        severity: 'error',
        summary: data['Components.Toast.Error.Summary'],
        detail: data['Error.Message'],
        life: 3000
      });
    });
  }
}
