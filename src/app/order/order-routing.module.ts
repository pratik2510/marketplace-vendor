import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderComponent } from './order.component';

const routes: Routes = [
  {
    path: '', component: OrderComponent,
    children: [
      { path: '', component: OrderListComponent },
      { path: 'filter', component: OrderListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
