import { Component, OnInit } from '@angular/core';
import { ShareModuleService } from '../share/service/share-module.service';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
