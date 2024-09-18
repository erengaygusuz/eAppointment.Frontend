import { Injectable } from '@angular/core';
import { LayoutService } from './app.layout.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  activeTheme: string = '';

  constructor(private layoutService: LayoutService) {}

  set theme(val: string) {
    this.layoutService.config.update(config => ({
      ...config,
      theme: val
    }));
  }

  get theme(): string {
    return this.layoutService.config().theme;
  }

  set colorScheme(val: string) {
    this.layoutService.config.update(config => ({
      ...config,
      colorScheme: val
    }));
  }

  get colorScheme(): string {
    return this.layoutService.config().colorScheme;
  }

  changeTheme(theme: string, colorScheme: string) {
    this.theme = theme;
    this.colorScheme = colorScheme;

    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
  }
}
