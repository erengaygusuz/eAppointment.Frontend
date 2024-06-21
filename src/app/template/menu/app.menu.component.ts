import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { CommonModule } from '@angular/common';
import { AppMenuitemComponent } from '../menu-item/app.menuitem.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitemComponent],
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        items: [
          {
            label: 'Home',
            icon: 'pi pi-fw fa-solid fa-house',
            routerLink: ['/']
          },
          {
            label: 'User',
            icon: 'pi pi-fw fa-solid fa-user',
            items: [
              {
                label: 'All Users',
                icon: 'pi pi-fw fa-solid fa-users',
                routerLink: ['/users']
              },
              {
                label: 'Create User',
                icon: 'pi pi-fw fa-solid fa-user-plus',
                items: [
                  {
                    label: 'Create Admin',
                    icon: 'pi pi-fw fa-solid fa-user-tie',
                    routerLink: ['/users/admin']
                  },
                  {
                    label: 'Create Doctor',
                    icon: 'pi pi-fw fa-solid fa-user-doctor',
                    routerLink: ['/users/doctor']
                  },
                  {
                    label: 'Create Patient',
                    icon: 'pi pi-fw fa-solid fa-bed',
                    routerLink: ['/users/patient']
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }
}
