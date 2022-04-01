import { Component } from '@angular/core';

@Component({
  selector: 'ngx-print-column-layout',
  styleUrls: ['./print-column.layout.scss'],
  template: `
  <nb-layout>
    <nb-layout-column class="p-0">
      <ng-content></ng-content>
    </nb-layout-column>
  </nb-layout>
  `,
})
export class PrintColumnLayoutComponent {

}
