import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ThemeService } from './services/theme.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, ToastModule, TranslateModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  unsubscribe = new Subject<void>();

  constructor(
    private primengConfig: PrimeNGConfig,
    private translate: TranslateService,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {
    this.primengConfig.csp.set({ nonce: '...' });

    if (localStorage.getItem('theme') && localStorage.getItem('colorScheme')) {
      this.themeService.theme = (
        localStorage.getItem('theme') || 'lara-light-indigo'
      ).toString();
      this.themeService.colorScheme = (
        localStorage.getItem('colorScheme') || 'light'
      ).toString();
    }

    if (localStorage.getItem('language') === null) {
      localStorage.setItem('language', 'tr-TR');
    }
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.primengConfig.zIndex = {
      modal: 1100, // dialog, sidebar
      overlay: 1000, // dropdown, overlaypanel
      menu: 1000, // overlay menus
      tooltip: 1100 // tooltip
    };

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.translate.use(data);

        this.translate
          .get('Components.PrimeNG')
          .subscribe(res => this.primengConfig.setTranslation(res));
      });
  }
}
