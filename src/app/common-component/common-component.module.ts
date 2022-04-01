import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { NbButtonModule, NbContextMenuModule, NbIconModule, NbMenuModule } from '@nebular/theme';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ChartsModule } from 'ng2-charts';
import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';

@NgModule({
  declarations: [
    DynamicTableComponent,
    DynamicChartComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    ReactiveFormsModule,
    TranslateModule,
    NbButtonModule,
    SplitButtonModule,
    TagModule,
    NbIconModule,
    NbMenuModule,
    NbContextMenuModule,
    ConfirmDialogModule,
    ToastModule,
    ChartsModule
  ],
  exports: [
    DynamicTableComponent,
    DynamicChartComponent
  ]
})
export class CommonComponentModule { }
