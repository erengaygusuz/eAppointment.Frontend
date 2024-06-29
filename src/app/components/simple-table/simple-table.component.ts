import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumnInfoModel } from '../../models/others/table.column.info.model';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { KeyValuePair } from '../../models/others/key.value.pair.model';

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    InputTextModule,
    RouterModule,
    TagModule
  ],
  templateUrl: './simple-table.component.html',
  styleUrl: './simple-table.component.css'
})
export class SimpleTableComponent {
  @Input() tableDatas: any;
  @Input() globalFilterFields: any;
  @Input() columnName: string = '';
  @Input() columnFieldName: string = '';
  @Input() tableColumnInfos: TableColumnInfoModel[] = [];

  @Input() columns: any;

  @Output() onGlobalFilter = new EventEmitter<{ table: Table; event: Event }>();

  @Input() tableData: any;

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
