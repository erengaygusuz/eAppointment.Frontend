import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterContentChecked
} from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
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
    DropdownModule
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

  selectedExportOption!: ExportOptionModel;

  exportOptions: ExportOptionModel[] = [];

  constructor(private translate: TranslateService) {
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

  getTranslationData(key: string) {
    this.translate
      .get(key, {
        totalItems: this.totalRecords,
        first: this.first,
        last: this.last
      })
      .subscribe(data => {
        this.currentPageReportTemplate = data;
      });
  }

  ngAfterContentChecked() {
    if (localStorage.getItem('language')) {
      this.translate.use(localStorage.getItem('language')!);
    } else {
      this.translate.use('tr-TR');
    }

    this.getTranslationData('Components.AdvancedTable.PaginatorInfo');

    this.translate.onLangChange.subscribe(() => {
      this.getTranslationData('Components.AdvancedTable.PaginatorInfo');
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

    this.getTranslationData('Components.AdvancedTable.PaginatorInfo');
  }

  lazyLoad(event: TableLazyLoadEvent) {
    this.dataLoad.emit({ event: event });
  }

  sendSearchTermToParent(): void {
    this.searchTermChange.emit(this.searchTerm);
    this.onGlobalFilter.emit();
  }

  exportAsFile(exportOptionIndex: number) {
    switch (exportOptionIndex) {
      // csv
      case 0:
        break;

      // xlsx
      case 1:
        break;

      // json
      case 2:
        break;

      // pdf
      case 3:
        break;

      // xml
      case 4:
        break;
    }
  }
}
