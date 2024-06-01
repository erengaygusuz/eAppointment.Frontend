import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PageHeaderComponent } from './page-header/page-header.component';
import { AdvancedTableComponent } from './advanced-table/advanced-table.component';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    PageHeaderComponent,
    AdvancedTableComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    DialogModule,
    BreadcrumbModule,
    InputTextModule 
  ],
  exports: [
    PageHeaderComponent,
    AdvancedTableComponent
  ]
})
export class ComponentsModule { }
