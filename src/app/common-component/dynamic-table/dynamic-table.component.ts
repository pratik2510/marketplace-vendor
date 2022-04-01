import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import { MessageService, SortEvent } from 'primeng/api';
import { filter, map } from 'rxjs/operators';
import { Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class DynamicTableComponent implements OnInit, OnChanges {

  @Input() columnData: any;
  @Input() TableContent: any;
  @Input() childColumnData: any;
  @Input() childTableKey: any;
  @Input() actions: any;
  @Input() masterTablePrimaryKey: any;
  @Input() childTablePrimaryKey: any;
  @Input() currentPage: number;
  @Input() scrollHeight: any;
  @Output() deleteChildRow = new EventEmitter<string>();
  @Output() appliedShorting = new EventEmitter<string>();
  sortingObj = {};

  selectedMasterId: any;
  selectedChildId: any;

  constructor(
    private menuService: NbMenuService,
    private router: Router,
    private translate: TranslateService,
    private messageService: MessageService,
  ) { }

  ngOnChanges() { }

  ngOnInit(): void {
    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'masterSettingMenu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        if (title === 'Duplicate' || title === 'Duplicada') {
          this.router.navigate(['/product/duplicate/' + this.selectedMasterId]);
        } else if (title === 'Edit' || title === 'Editar') {
          if (this.actions && this.actions['isLiveProductPage']) {
            this.router.navigate(['/product/live/edit/' + this.selectedMasterId]);
          } else {
            this.router.navigate(['/product/edit/' + this.selectedMasterId]);
          }
        } else if (title === 'Download PO' || title === 'Descargar PO') {
          if (this.selectedMasterId) {
            const url = this.router.serializeUrl(
              this.router.createUrlTree([`/print/${this.selectedMasterId}`])
            );
            window.open(url, '_blank');
          }
        }
        this.selectedMasterId = null;
      });

    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'childSettingMenu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        if (title === 'Delete' || title === 'Borrar') {
          this.showConfirm();
        }
      });

    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'settingMenu_live'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        if (title === 'Edit' || title === 'Editar') {
          this.router.navigate(['/product/live/edit/' + this.selectedMasterId]);
        }
      });

  }

  settingClick(selectedMasterTableId, selectedChildTableId) {
    this.selectedMasterId = selectedMasterTableId;
    this.selectedChildId = selectedChildTableId;
  }

  getCellValue(key, rowData) {
    if (key) {
      const keyArr = key.split('.');
      let obj;
      if (keyArr && keyArr.length > 0) {
        for (let index = 0; index < keyArr.length; index++) {
          const key = keyArr[index];
          if (index === 0) {
            obj = rowData[key];
          } else {
            obj = obj[key];
          }
          if (index === keyArr.length - 1) {
            return obj;
          }
        }
      } else {
        return key;
      }
    }
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ severity: 'info', key: 'deleteVariant', sticky: true, summary: 'Are you sure?', detail: 'Confirm to proceed' });
  }

  onReject() {
    this.messageService.clear('deleteVariant');
  }

  onConfirm() {
    this.deleteChildRow.emit("ChildMenu_Delete||" + this.selectedChildId);
    this.messageService.clear('deleteVariant');
  }

  applyShort(columnName) {
    // Sidebar Options
    this.translate.stream([
      columnName
    ]).subscribe(res => {
      columnName = res[columnName];
    });
    if (this.sortingObj[columnName]) {
      this.sortingObj[columnName] === 'asd' ? this.sortingObj[columnName] = 'desc' : this.sortingObj[columnName] = 'asd';
    } else {
      this.sortingObj[columnName] = 'asd';
    }
    this.appliedShorting.emit("appliedShorting||" + JSON.stringify(this.sortingObj));
  }

}