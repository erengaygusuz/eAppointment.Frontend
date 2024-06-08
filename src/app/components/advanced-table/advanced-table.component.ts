import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumnInfoModel } from '../../models/table.column.info.model';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-advanced-table',
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
