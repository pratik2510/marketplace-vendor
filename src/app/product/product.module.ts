import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ThemeModule } from '../@theme/theme.module';
import { NbMenuModule } from '@nebular/theme';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { CKEditorModule } from 'ckeditor4-angular';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginatorModule } from 'primeng/paginator';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CommonComponentModule } from '../common-component/common-component.module';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  declarations: [
    ProductComponent,
    ProductFormComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
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
    TagModule,
    ScrollToModule.forRoot(),
    CKEditorModule,
    DropdownModule,
    BreadcrumbModule,
    TranslateModule,
    ConfirmDialogModule,
    TableModule,
    NgbModalModule,
    PaginatorModule,
    ToastModule,
    CommonComponentModule
  ]
})
export class ProductModule { }
