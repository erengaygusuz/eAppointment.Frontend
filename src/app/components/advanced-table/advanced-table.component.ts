import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumnInfoModel } from '../../models/table.column.info.model';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    ConfirmDialogModule,
    ToolbarModule,
    ToastModule,
    InputTextModule
  ],
  templateUrl: './advanced-table.component.html',
  styleUrl: './advanced-table.component.css'
})
export class AdvancedTableComponent {
  
  @Input() tableDatas: any;
  @Input() globalFilterFields: any;
  @Input() columnName: string = "";
  @Input() columnFieldName: string = "";
  @Input() tableColumnInfos: TableColumnInfoModel[] = [];

  @Output() addRecord = new EventEmitter<any>();
  @Output() onGlobalFilter = new EventEmitter<{ table: Table, event: Event }>();

  @Input() tableData: any;

  @Output() editRecord = new EventEmitter<{ tableData: any }>();
  @Output() deleteRecord = new EventEmitter<{ tableData: any }>();

  @Input() tableSummaryInfo: string = "";
  @Input() tableSearchBoxPlaceHolder: string = "";

  getTableColumnData<T extends any>(model: T): object[]{

    let tempDataList: any[] = [];
    
    let index = 0;

    for (let prop in model) {
      if(index !== 0){
        tempDataList.push(model[prop]);
      }

      index++;
    }

    return tempDataList;
  }
}
