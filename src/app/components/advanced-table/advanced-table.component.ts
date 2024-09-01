import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterContentChecked
} from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { Severity } from '../../models/others/severity.model';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { DropdownModule } from 'primeng/dropdown';
import { ExportOptionModel } from '../../models/others/export.option.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    InputTextModule,
    RouterModule,
    TagModule,
    TranslateModule,
    NgIcon,
    DropdownModule,
    ToastModule
  ],
  templateUrl: './advanced-table.component.html',
  styleUrl: './advanced-table.component.css'
})
export class AdvancedTableComponent implements AfterContentChecked {
  @Input() tableDatas: any;

  @Input() columns: any;

  @Output() onGlobalFilter = new EventEmitter();

  @Input() tableData: any;

  @Output() editRecord = new EventEmitter<{ tableData: any }>();
  @Output() deleteRecord = new EventEmitter<{ tableData: any }>();

  @Input() severityList: Severity[] = [];

  @Input() searchTerm: any;
  @Output() searchTermChange = new EventEmitter<string>();

  @Input() loading: any;

  @Input() totalRecords: any;

  @Input() multiSortMeta: any;

  @Input() rowsPerPage: number = 0;

  rowsPerPageOptions: number[] = [5, 10, 20];

  currentPageReportTemplate: string = '';

  first: number = 1;
  last: number = 5;

  @Output() dataLoad = new EventEmitter<{ event: TableLazyLoadEvent }>();

  selectedExportOption: ExportOptionModel = {
    value: -1,
    label: '',
    iconName: '',
    color: ''
  };

  exportOptions: ExportOptionModel[] = [];

  exportToastTitle: string = '';
  exportToastMessage: string = '';

  constructor(
    private translate: TranslateService,
    private messageService: MessageService
  ) {
    this.exportOptions = [
      {
        value: 0,
        label: 'CSV',
        iconName: 'bootstrapFiletypeCsv',
        color: 'green'
      },
      {
        value: 1,
        label: 'XLSX',
        iconName: 'bootstrapFiletypeXlsx',
        color: 'blue'
      },
      {
        value: 2,
        label: 'JSON',
        iconName: 'bootstrapFiletypeJson',
        color: 'gray'
      },
      {
        value: 3,
        label: 'PDF',
        iconName: 'bootstrapFiletypePdf',
        color: 'red'
      },
      {
        value: 4,
        label: 'XML',
        iconName: 'bootstrapFiletypeXml',
        color: 'orange'
      }
    ];
  }

  getTranslationData(key1: string, key2: string) {
    this.translate
      .get(key1, {
        totalItems: this.totalRecords,
        first: this.first,
        last: this.last
      })
      .subscribe(data => {
        this.currentPageReportTemplate = data;
      });

    this.translate.get(key2).subscribe(data => {
      this.exportToastTitle = data.ExportOptionToast.Title;
      this.exportToastMessage = data.ExportOptionToast.Message;
    });
  }

  ngAfterContentChecked() {
    if (localStorage.getItem('language')) {
      this.translate.use(localStorage.getItem('language')!);
    } else {
      this.translate.use('tr-TR');
    }

    this.getTranslationData(
      'Components.AdvancedTable.PaginatorInfo',
      'Components.AdvancedTable.ExportModule'
    );

    this.translate.onLangChange.subscribe(() => {
      this.getTranslationData(
        'Components.AdvancedTable.PaginatorInfo',
        'Components.AdvancedTable.ExportModule'
      );
    });
  }

  getSeverity(value: string): any {
    for (let i = 0; i < this.severityList.length; i++) {
      if (value == this.severityList[i].value) {
        return this.severityList[i].color;
      }
    }
  }

  getTranslatedText(value: string): any {
    for (let i = 0; i < this.severityList.length; i++) {
      if (value == this.severityList[i].value) {
        return this.severityList[i].translatedText;
      }
    }
  }

  onPageChange(event: any) {
    const currentPage = Math.ceil((event.first - 1) / event.rows + 1);
    this.first = event.first + 1;
    this.rowsPerPage = event.rows;
    this.last = this.totalRecords;

    if (this.rowsPerPage < this.totalRecords) {
      this.last = this.rowsPerPage * currentPage;

      if (this.last > this.totalRecords) {
        this.last = this.totalRecords;
      }
    }

    this.getTranslationData(
      'Components.AdvancedTable.PaginatorInfo',
      'Components.AdvancedTable.ExportModule'
    );
  }

  lazyLoad(event: TableLazyLoadEvent) {
    this.dataLoad.emit({ event: event });
  }

  sendSearchTermToParent(): void {
    this.searchTermChange.emit(this.searchTerm);
    this.onGlobalFilter.emit();
  }

  exportAsFile() {
    switch (this.selectedExportOption.value) {
      case 0:
        this.exportToCsv();

        break;

      case 1:
        this.exportToExcel();

        break;

      case 2:
        this.exportToJson();

        break;

      case 3:
        this.exportToPdf();

        break;

      case 4:
        this.exportToXml();

        break;

      default:
        this.messageService.add({
          severity: 'warn',
          summary: this.exportToastTitle,
          detail: this.exportToastMessage,
          life: 3000
        });
    }
  }

  exportToJson() {
    const json = JSON.stringify(this.tableDatas);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'table-data.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  exportToXml() {
    const xml = this.convertToXml(this.tableDatas);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'table-data.xml';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  convertToXml(data: any[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n';

    data.forEach(row => {
      xml += '  <row>\n';
      Object.keys(row).forEach(key => {
        xml += `    <${key}>${row[key]}</${key}>\n`;
      });
      xml += '  </row>\n';
    });

    xml += '</rows>';

    return xml;
  }

  exportToCsv() {
    const csv = this.convertToCsv(this.tableDatas);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'table-data.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  convertToCsv(data: any[]): string {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(row => Object.values(row).join(',')).join('\n');

    return header + rows;
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableDatas);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'table-data.xlsx');
  }

  exportToPdf() {
    const doc = new jsPDF();

    const col = Object.keys(this.tableDatas[0]);
    const rows = this.tableDatas.map((row: any) => Object.values(row));

    autoTable(doc, {
      head: [col],
      body: rows
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-data.pdf';
    a.click();

    URL.revokeObjectURL(url);
  }

  clearFilters(table: Table) {
    table.clear();
    this.searchTerm = '';
    this.searchTermChange.emit(this.searchTerm);
    this.onGlobalFilter.emit();
  }
}
