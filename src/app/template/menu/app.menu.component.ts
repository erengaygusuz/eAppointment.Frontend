import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { CommonModule } from '@angular/common';
import { AppMenuitemComponent } from '../menu-item/app.menuitem.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitemComponent, TranslateModule],
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent {
  model: any[] = [];

  menuItems: any;

  constructor(
    public layoutService: LayoutService,
    private translate: TranslateService
  ) {
    if (localStorage.getItem('language')) {
      this.translate.use(localStorage.getItem('language')!);
    } else {
      this.translate.use('tr-TR');
    }

    this.getTranslationData('Sidebar.MenuItems');

    this.translate.onLangChange.subscribe(() => {
      this.getTranslationData('Sidebar.MenuItems');
    });
  }

  getTranslationData(key: string) {
    this.translate.get(key).subscribe(data => {
      this.menuItems = data;

      this.model = [
        {
          items: [
            {
              label: this.menuItems[0].Name,
              icon: 'pi pi-fw fa-solid fa-house',
              routerLink: ['/']
            },
            {
              label: this.menuItems[1].Name,
              icon: 'pi pi-fw fa-solid fa-user',
              items: [
                {
                  label: this.menuItems[1].SubItems[0].Name,
                  icon: 'pi pi-fw fa-solid fa-users',
                  routerLink: ['/users']
                },
                {
                  label: this.menuItems[1].SubItems[1].Name,
                  icon: 'pi pi-fw fa-solid fa-user-plus',
                  items: [
                    {
                      label: this.menuItems[1].SubItems[1].SubItems[0].Name,
                      icon: 'pi pi-fw fa-solid fa-user-tie',
                      routerLink: ['/users/admin']
                    },
                    {
                      label: this.menuItems[1].SubItems[1].SubItems[1].Name,
                      icon: 'pi pi-fw fa-solid fa-user-doctor',
                      routerLink: ['/users/doctor']
                    },
                    {
                      label: this.menuItems[1].SubItems[1].SubItems[2].Name,
                      icon: 'pi pi-fw fa-solid fa-bed',
                      routerLink: ['/users/patient']
                    }
                  ]
                }
              ]
            },
            {
              label: this.menuItems[2].Name,
              icon: 'pi pi-fw fa-solid fa-calendar',
              items: [
                {
                  label: this.menuItems[2].SubItems[0].Name,
                  icon: 'pi pi-fw fa-solid fa-calendar-days',
                  routerLink: ['/appointments']
                },
                {
                  label: this.menuItems[2].SubItems[1].Name,
                  icon: 'pi pi-fw fa-solid fa-calendar-plus',
                  routerLink: ['/appointment']
                }
              ]
            }
          ]
        }
      ];
    });
  }
}
