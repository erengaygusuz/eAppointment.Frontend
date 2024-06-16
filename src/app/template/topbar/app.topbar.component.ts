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
import { RoleModel } from '../../models/role.model';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule],
  templateUrl: './app.topbar.component.html',
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

  userRoles: string = "";

  constructor(
    public layoutService: LayoutService,
    private topbarService: TopBarService,
    private themeService: ThemeService,
    public authService: AuthService,
    private router: Router,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.themeService.setTheme(this.selectedTheme);

    this.countries = [
      { name: 'Turkey', code: 'TR' },
      { name: 'United Kingdoms', code: 'GB' },
      { name: 'United States', code: 'US' },
    ];

    this.selectedCountry = this.countries[0];

    this.getUserRoles(this.authService.tokenDecode.id);
  }

  onThemeChange(theme: string, themeCondition: boolean) {
    console.log(theme);
    console.log(themeCondition);

    this.selectedTheme = theme;
    this.themeService.setTheme(theme);
    this.isDarkThemeSelected = themeCondition;
  }

  onTopbarClick() {
    this.topbarService.onTopbarClick();
  }

  signOut(){
    localStorage.removeItem("token");
    this.router.navigateByUrl("/login");
  }

  getUserRoles(id: string) {

    this.http.post<RoleModel[]>("users/getallrolesbyuserid", {id: id}, res => {

      this.userRoles = res.data.map((role: RoleModel) => { return role.name }).join(',');

    });
  }
}
