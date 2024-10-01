import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { CommonModule } from '@angular/common';
import { AppMenuitemComponent } from '../menu-item/app.menuitem.component';
import { HttpService } from '../../services/http.service';
import { GetMenuItemsQueryModel } from '../../models/roles/get.menu.items.query.model';
import { TokenService } from '../../services/token.service';
import { GetMenuItemsQueryResponseModel } from '../../models/roles/get.menu.items.query.response.model';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitemComponent],
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent {
  menuItems: any;

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  constructor(
    public layoutService: LayoutService,
    private http: HttpService,
    private tokenService: TokenService,
    private languageService: LanguageService
  ) {
    this.menuItems = [
      {
        items: []
      }
    ];

    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.getMenuItems();
      });
  }

  getMenuItems() {
    const roleName = this.tokenService.getRole();

    const getMenuItemsQueryModel = new GetMenuItemsQueryModel();

    getMenuItemsQueryModel.roleName = roleName;

    this.http.get<GetMenuItemsQueryResponseModel>(
      'roles/getmenuitems?roleName=' + getMenuItemsQueryModel.roleName,
      res => {
        this.menuItems[0].items = res.data.items;
      }
    );
  }
}
