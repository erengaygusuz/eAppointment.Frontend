import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumnInfoModel } from '../../models/table.column.info.model';
import { Table } from 'primeng/table';
import { DoctorModel } from '../../models/doctor.model';

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

  @Output() editRecord = new EventEmitter<{ tableData: DoctorModel }>();
  @Output() deleteRecord = new EventEmitter<{ tableData: DoctorModel }>();
}
