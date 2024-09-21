import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { CommonModule } from '@angular/common';
import { AppMenuitemComponent } from '../menu-item/app.menuitem.component';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitemComponent],
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent {
  model: any;

  menuItems: any;

  constructor(
    public layoutService: LayoutService,
    private tokenService: TokenService
  ) {
    this.menuItems = [
      {
        items: []
      }
    ];

    this.menuItems[0].items = this.tokenService.getMenuItems();
  }
}
