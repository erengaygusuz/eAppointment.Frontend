import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { DropdownModule } from 'primeng/dropdown';
import { AppointmentDialogComponent } from '../appointments/appointment-dialog/appointment-dialog.component';
import { ToastModule } from 'primeng/toast';

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
    AppointmentDialogComponent,
    ToastModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe, MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit(): void {
    this.items = [{ label: 'Home Page' }];
    this.home = { icon: 'pi fa-solid fa-house', routerLink: '/' };
  }
}
