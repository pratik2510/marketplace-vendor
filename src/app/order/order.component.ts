import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShareModuleService } from '../share/service/share-module.service';

@Component({
  selector: 'ngx-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  menu = <any>[];
  unsubscribe$;

  constructor(
    private shareModuleService: ShareModuleService
  ) { }

  ngOnInit(): void {
    this.unsubscribe$ = this.shareModuleService.currentSidebarMenu.subscribe(sidebarMenu => {
      this.menu = sidebarMenu;
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) { this.unsubscribe$.unsubscribe(); }
  }
}
