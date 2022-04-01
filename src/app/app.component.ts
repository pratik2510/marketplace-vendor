import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ShareModuleService } from './share/service/share-module.service';

@Component({
  selector: 'ngx-app',
  template: `
  <router-outlet>
  <p-toast position="top-right" baseZIndex="999"></p-toast>
  </router-outlet>`,
})
export class AppComponent implements OnInit {

  menu = <any>[];
  unsubscribe$;

  constructor(
    private translate: TranslateService,
    private shareModuleService: ShareModuleService
  ) {
    if (localStorage.getItem('lang')) {
      this.translate.setDefaultLang(localStorage.getItem('lang'));
    } else {
      localStorage.setItem('lang', 'en');
      this.translate.setDefaultLang('en');
    }

    // Sidebar Options
    this.translate.stream([
      'SIDEBAR_MENU.DASHBOARD',
      'SIDEBAR_MENU.PRODUCT',
      'SIDEBAR_MENU.MY_PRODUCTS',
      'SIDEBAR_MENU.LIVE_PRODUCT',
      'SIDEBAR_MENU.ORDER'
    ]).subscribe(res => {
      const MENU_ITEMS = [
        {
          title: res['SIDEBAR_MENU.DASHBOARD'],
          icon: 'home-outline',
          link: '/dashboard',
        },
        {
          title: res['SIDEBAR_MENU.PRODUCT'],
          icon: 'browser-outline',
          children: [
            {
              title: res['SIDEBAR_MENU.MY_PRODUCTS'],
              link: '/product',
            },
            {
              title: res['SIDEBAR_MENU.LIVE_PRODUCT'],
              link: '/product/live',
            }
          ],
        },
        {
          title: res['SIDEBAR_MENU.ORDER'],
          icon: 'browser-outline',
          link: '/order',
        }
      ];
      this.shareModuleService.changeSidebarMenu.next(MENU_ITEMS);
    });
  }

  ngOnInit(): void {
  }
}
