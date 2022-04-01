import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {
    path: '', component: ProductComponent,
    children: [
      {
        path: '',
        component: ProductListComponent
        // component: ListProductComponent
      },
      {
        path: 'live',
        component: ProductListComponent
        // component: ListProductComponent
      },
      {
        path: 'filter',
        component: ProductListComponent
        // component: ListProductComponent
      },
      {
        path: 'new',
        component: ProductFormComponent
      },
      {
        path: 'duplicate/:duplicatePID',
        component: ProductFormComponent
      },
      {
        path: 'edit/:productId',
        component: ProductFormComponent
      },
      {
        path: 'live/edit/:liveProductId',
        component: ProductFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
