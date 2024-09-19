import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../services/app.layout.service';
import { TopBarService } from '../../services/topbar.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    TranslateModule,
    ButtonModule
  ],
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  countries: any[] | undefined;

  selectedCountry: any | undefined;

  userRoles: string = '';

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  constructor(
    public layoutService: LayoutService,
    private topbarService: TopBarService,
    public themeService: ThemeService,
    public tokenService: TokenService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.countries = [
      { name: '', code: 'TR', languageCode: 'tr-TR' },
      { name: '', code: 'GB', languageCode: 'en-GB' },
      { name: '', code: 'US', languageCode: 'en-US' }
    ];

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData('Topbar.LanguageOptions');
      });
  }

  getTranslationData(key: string) {
    this.translate.get(key).subscribe(data => {
      this.countries = this.countries?.map((element, index) => {
        return { ...element, name: data[index].Name };
      });

      this.selectedCountry = this.countries!.filter(
        x => x.languageCode == this.selectedLanguage
      )[0];

      this.translate.use(this.selectedCountry.languageCode);
    });
  }

  onTopbarClick() {
    this.topbarService.onTopbarClick();
  }

  onLanguageChange(language: string) {
    this.translate.use(language);

    localStorage.setItem('language', language);

    this.selectedCountry = this.countries!.filter(
      x => x.languageCode == language
    )[0];

    this.languageService.setLanguage(language);
  }

  signOut() {
    sessionStorage.removeItem('auth_token');
    this.router.navigateByUrl('/login');
  }

  openProfilePage() {
    this.router.navigateByUrl(
      '/users/' +
        this.tokenService.getRole().toLowerCase() +
        '/' +
        this.tokenService.getUserId() +
        '/profile'
    );
  }
}
