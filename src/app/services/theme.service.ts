import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  activeTheme: string = '';

  getTheme(){
    return this.activeTheme;
  }

  setTheme(theme: string){
    let themeLink = document.getElementById('theme-css') as HTMLLinkElement;

    console.log(themeLink)

    if (themeLink){
      themeLink.href = theme + '.css';
    }

    this.activeTheme = theme;
  }
}
