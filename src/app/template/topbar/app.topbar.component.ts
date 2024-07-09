import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../services/app.layout.service';
import { TopBarService } from '../../services/topbar.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, TranslateModule],
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  selectedTheme: string = 'assets/layout/styles/theme/lara-light-indigo/theme';

  isDarkThemeSelected: boolean = false;

  countries: any[] | undefined;

  selectedCountry: any | undefined;

  userRoles: string = '';

  constructor(
    public layoutService: LayoutService,
    private topbarService: TopBarService,
    private themeService: ThemeService,
    public authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('themeOption')) {
      this.themeService.setTheme(localStorage.getItem('themeOption')!);

      this.selectedTheme = localStorage.getItem('themeOption')!;
    } else {
      this.themeService.setTheme(this.selectedTheme);
    }

    if (
      this.selectedTheme ===
      'assets/layout/styles/theme/lara-light-indigo/theme'
    ) {
      this.isDarkThemeSelected = false;
    } else {
      this.isDarkThemeSelected = true;
    }

    this.countries = [
      { name: '', code: 'TR', languageCode: 'tr-TR' },
      { name: '', code: 'GB', languageCode: 'en-GB' },
      { name: '', code: 'US', languageCode: 'en-US' }
    ];

    this.translate.onLangChange.subscribe(() => {
      this.getTranslationData('Topbar.LanguageOptions');
    });
  }

  getTranslationData(key: string) {
    this.translate.get(key).subscribe(data => {
      this.countries = this.countries?.map((element, index) => {
        return { ...element, name: data[index].Name };
      });

      if (localStorage.getItem('language')) {
        this.selectedCountry = this.countries!.filter(
          x => x.languageCode == localStorage.getItem('language')
        )[0];

        this.translate.use(this.selectedCountry.languageCode);
      } else {
        this.selectedCountry = this.countries!.filter(
          x => x.languageCode == 'tr-TR'
        )[0];

        this.translate.use(this.selectedCountry.languageCode);
      }
    });
  }

  onThemeChange(theme: string, themeCondition: boolean) {
    this.selectedTheme = theme;
    this.themeService.setTheme(theme);
    this.isDarkThemeSelected = themeCondition;

    localStorage.setItem('themeOption', theme);
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
  }

  signOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
