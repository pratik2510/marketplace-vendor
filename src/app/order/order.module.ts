import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbActionsModule, NbButtonModule, NbCardModule,
  NbCheckboxModule, NbContextMenuModule,
  NbDatepickerModule, NbIconModule, NbInputModule,
  NbMenuModule, NbRadioModule, NbSelectModule, NbUserModule
} from '@nebular/theme';
import { ProductRoutingModule } from '../product/product-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CKEditorModule } from 'ng2-ckeditor';
import { DropdownModule } from 'primeng/dropdown';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { CommonComponentModule } from '../common-component/common-component.module';


@NgModule({
  declarations: [
    OrderComponent,
    OrderListComponent,
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NbMenuModule,
    NbContextMenuModule,
    NbIconModule,
    ProductRoutingModule,
    ThemeModule,
    NbActionsModule,
    NbButtonModule,
    SplitButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbInputModule,
    NbRadioModule,
    CheckboxModule,
    NbSelectModule,
    ChipsModule,
    NbUserModule,
    CKEditorModule,
    DropdownModule,
    CalendarModule,
    BreadcrumbModule,
    TranslateModule,
    ConfirmDialogModule,
    TableModule,
    NgbModalModule,
    PaginatorModule,
    CommonComponentModule
  ]
})
export class OrderModule { }
