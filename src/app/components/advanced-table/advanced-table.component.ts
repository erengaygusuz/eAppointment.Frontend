import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { KeyValuePair } from '../../models/others/key.value.pair.model';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    ConfirmDialogModule,
    ToolbarModule,
    ToastModule,
    InputTextModule,
    RouterModule,
    TagModule
  ],
  templateUrl: './advanced-table.component.html',
  styleUrl: './advanced-table.component.css'
})
export class AdvancedTableComponent {
  @Input() tableDatas: any;
  @Input() globalFilterFields: any;

  @Input() columns: any;

  @Output() onGlobalFilter = new EventEmitter<{ table: Table; event: Event }>();

  @Input() tableData: any;

  @Output() editRecord = new EventEmitter<{ tableData: any }>();
  @Output() deleteRecord = new EventEmitter<{ tableData: any }>();

  @Input() tableSummaryInfo: string = '';
  @Input() tableSearchBoxPlaceHolder: string = '';

  @Input() severityList: KeyValuePair[] = [];

  getSeverity(value: string): any {
    for (let i = 0; i < this.severityList.length; i++) {
      if (value == this.severityList[i].key) {
        return this.severityList[i].value;
      }
    }
  }
}
