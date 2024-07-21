import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterContentChecked
} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { Severity } from '../../models/others/severity.model';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [
    CommonModule,
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
  @Input() globalFilterFields: any;

  @Input() columns: any;

  @Output() onGlobalFilter = new EventEmitter<{ table: Table; event: Event }>();

  @Input() tableData: any;

  @Output() editRecord = new EventEmitter<{ tableData: any }>();
  @Output() deleteRecord = new EventEmitter<{ tableData: any }>();

  @Input() severityList: Severity[] = [];

  first: number = 1;
  last: number = 5;
  itemsPerPage: number = 5;

  rowsPerPageOptions: number[] = [5, 10, 20];

  currentPageReportTemplate: string = '';

  constructor(private translate: TranslateService) {}

  getTranslationData(key: string) {
    this.translate
      .get(key, {
        totalItems: this.tableDatas.length,
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
    this.itemsPerPage = event.rows;
    const totalItems = this.tableDatas.length;
    this.last = totalItems;

    if (this.itemsPerPage < totalItems) {
      this.last = this.itemsPerPage * currentPage;

      if (this.last > totalItems) {
        this.last = totalItems;
      }
    }

    this.getTranslationData('Components.AdvancedTable.PaginatorInfo');
  }
}
