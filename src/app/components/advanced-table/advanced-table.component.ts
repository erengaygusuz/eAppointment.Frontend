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
    TranslateModule
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

  constructor(private translate: TranslateService) {}

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
}
