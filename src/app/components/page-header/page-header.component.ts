import { Component, Input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css'
})
export class PageHeaderComponent {
  @Input() pageTitle: string = '';
  @Input() breadcrumbItems: any;
}
