import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    DropdownModule,
    FullCalendarModule,
    ToastModule,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe, MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit {
  items: MenuItem[] = [{ label: '' }];
  home: MenuItem | undefined;

  pageTitle: string = '';

  constructor(private translate: TranslateService) {
    if (localStorage.getItem('language')) {
      this.translate.use(localStorage.getItem('language')!);
    } else {
      this.translate.use('tr-TR');
    }

    this.getTranslationData('Pages.Home');

    this.translate.onLangChange.subscribe(() => {
      this.getTranslationData('Pages.Home');
    });
  }

  ngOnInit(): void {
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };
  }

  getTranslationData(key: string) {
    this.translate.get(key).subscribe(data => {
      this.items = this.items?.map((element, index) => {
        return { ...element, label: data.BreadcrumbItems[index].Name };
      });
      this.pageTitle = data.Title;
    });
  }
}
