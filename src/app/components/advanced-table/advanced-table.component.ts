import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumnInfoModel } from '../../models/others/table.column.info.model';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    ConfirmDialogModule,
    ToolbarModule,
    ToastModule,
    InputTextModule,
    RouterModule
  ],
  templateUrl: './advanced-table.component.html',
  styleUrl: './advanced-table.component.css'
})
export class AdvancedTableComponent {
  @Input() tableDatas: any;
  @Input() globalFilterFields: any;
  @Input() columnName: string = '';
  @Input() columnFieldName: string = '';
  @Input() tableColumnInfos: TableColumnInfoModel[] = [];

  @Output() onGlobalFilter = new EventEmitter<{ table: Table; event: Event }>();

  @Input() tableData: any;

  @Output() editRecord = new EventEmitter<{ tableData: any }>();
  @Output() deleteRecord = new EventEmitter<{ tableData: any }>();

  @Input() tableSummaryInfo: string = '';
  @Input() tableSearchBoxPlaceHolder: string = '';

  getTableColumnData<T>(model: T): object[] {
    const tempDataList: any[] = [];

    let index = 0;

    for (const prop in model) {
      if (index !== 0) {
        tempDataList.push(model[prop]);
      }

      index++;
    }

    return tempDataList;
  }
}
