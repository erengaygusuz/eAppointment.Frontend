import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { CommonModule } from '@angular/common';
import { AppMenuitemComponent } from '../menu-item/app.menuitem.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PERMISSIONS } from '../../enums/Permissions';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitemComponent, TranslateModule],
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent {
  model: any;

  menuItems: any;

  visibleModel: any;

  permissionList: string[] = [];

  constructor(
    public layoutService: LayoutService,
    private translate: TranslateService,
    private tokenService: TokenService
  ) {
    this.permissionList = this.tokenService.getUserPermissions();

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

      this.visibleModel = [
        {
          items: []
        }
      ];

      this.model = [
        {
          items: [
            {
              label: this.menuItems[0].Name,
              icon: 'pi pi-fw fa-solid fa-house',
              permission: '',
              disabled: true,
              routerLink: ['/']
            },
            {
              label: this.menuItems[1].Name,
              icon: 'pi pi-fw fa-solid fa-user',
              permission: PERMISSIONS.GET_ALL_USERS,
              items: [
                {
                  label: this.menuItems[1].SubItems[0].Name,
                  icon: 'pi pi-fw fa-solid fa-users',
                  permission: '',
                  routerLink: ['/users']
                },
                {
                  label: this.menuItems[1].SubItems[1].Name,
                  icon: 'pi pi-fw fa-solid fa-user-plus',
                  permission: '',
                  items: [
                    {
                      label: this.menuItems[1].SubItems[1].SubItems[0].Name,
                      icon: 'pi pi-fw fa-solid fa-user-tie',
                      permission: '',
                      routerLink: ['/users/admin']
                    },
                    {
                      label: this.menuItems[1].SubItems[1].SubItems[1].Name,
                      icon: 'pi pi-fw fa-solid fa-user-doctor',
                      permission: '',
                      routerLink: ['/users/doctor']
                    },
                    {
                      label: this.menuItems[1].SubItems[1].SubItems[2].Name,
                      icon: 'pi pi-fw fa-solid fa-bed',
                      permission: '',
                      routerLink: ['/users/patient']
                    }
                  ]
                }
              ]
            },
            {
              label: this.menuItems[2].Name,
              icon: 'pi pi-fw fa-solid fa-calendar',
              permission: PERMISSIONS.GET_ALL_APPOINTMENTS_BY_PATIENT_ID,
              items: [
                {
                  label: this.menuItems[2].SubItems[0].Name,
                  icon: 'pi pi-fw fa-solid fa-calendar-days',
                  permission: '',
                  routerLink: ['/my-appointments']
                },
                {
                  label: this.menuItems[2].SubItems[1].Name,
                  icon: 'pi pi-fw fa-solid fa-calendar-plus',
                  permission: '',
                  routerLink: ['/appointment']
                }
              ]
            },
            {
              label: this.menuItems[3].Name,
              icon: 'pi pi-fw fa-solid fa-calendar-check',
              permission: PERMISSIONS.GET_ALL_APPOINTMENTS_BY_DOCTOR_ID,
              routerLink: ['/appointments']
            }
          ]
        }
      ];

      this.updateMenuItems();
    });
  }

  updateMenuItems() {
    this.visibleModel[0].items = this.model[0].items.filter((item: any) => {
      this.isVisible(item.permission);
    });

    this.model[0].items.filter((item: any) => {
      const result = this.isVisible(item.permission);

      if (result) {
        this.visibleModel[0].items.push(item);
      }
    });
  }

  isVisible(permission: string) {
    if (permission === '') {
      return true;
    }
    return this.permissionList.includes(permission);
  }
}
