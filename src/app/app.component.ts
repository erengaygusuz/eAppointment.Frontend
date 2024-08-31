import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  unsubscribe = new Subject<void>();

  constructor(
    private primengConfig: PrimeNGConfig,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.primengConfig.csp.set({ nonce: '...' });
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
