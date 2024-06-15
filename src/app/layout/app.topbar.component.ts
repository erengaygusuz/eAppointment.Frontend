import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { TopBarService } from '../services/topbar.service';
import { ThemeService } from '../services/theme.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    selectedTheme: string = 'assets/layout/styles/theme/lara-light-indigo/theme'

    isDarkThemeSelected: boolean = false;

    constructor(public layoutService: LayoutService, private topbarService: TopBarService, private themeService: ThemeService ) { }

    ngOnInit(): void {
        this.themeService.setTheme(this.selectedTheme);
    }

    onThemeChange(theme: string, themeCondition: boolean){

        console.log(theme)
        console.log(themeCondition)

        this.selectedTheme = theme;
        this.themeService.setTheme(theme);
        this.isDarkThemeSelected = themeCondition;
    }

    onTopbarClick(){
        this.topbarService.onTopbarClick();
    }
}
