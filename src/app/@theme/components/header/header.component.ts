import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  userMenu = [{ title: 'Profile' }, { title: 'Change password' }, { title: 'Log out' }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService) { }

  ngOnInit() {

    this.user = window.localStorage.getItem('sellerName');
    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'myprofile-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        if (title === 'Log out' || title === 'Cerrar sesión') {
          this.authService.logout();
        } else if (title === 'Change password' || title === 'Cambiar la contraseña') {
          this.router.navigate(['/auth/change-password']);
        } else if (title === 'Profile' || title === 'Perfil') {
          this.router.navigate(['/user/profile']);
        }
      });

    const { xl } = this.breakpointService.getBreakpointsMap();

    this.themeService.onMediaQueryChange()
      .pipe(map(([, currentBreakpoint]) => currentBreakpoint.width < xl), takeUntil(this.destroy$),)
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    // Sidebar Options
    this.translate.stream([
      'DROPDOWN_OPTION.USER_PROFILE',
      'DROPDOWN_OPTION.CHANGE_PASSWORD',
      'DROPDOWN_OPTION.LOGOUT'
    ]).subscribe(res => {
      this.userMenu = [
        { title: res['DROPDOWN_OPTION.USER_PROFILE'] },
        { title: res['DROPDOWN_OPTION.CHANGE_PASSWORD'] },
        { title: res['DROPDOWN_OPTION.LOGOUT'] }
      ];
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
