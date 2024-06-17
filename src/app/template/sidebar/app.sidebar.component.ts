import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { AppMenuComponent } from '../menu/app.menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenuComponent],
  templateUrl: './app.sidebar.component.html',
})
export class AppSidebarComponent {
  constructor(
    public layoutService: LayoutService,
    public el: ElementRef,
  ) {}
}
