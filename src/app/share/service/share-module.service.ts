import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ShareModuleService {

  private changeLanguage = new BehaviorSubject('en');
  currentLanguage = this.changeLanguage.asObservable();

  public changeSidebarMenu = new BehaviorSubject([]);
  currentSidebarMenu = this.changeSidebarMenu.asObservable();

  constructor(
    private translate: TranslateService,
    private http: HttpClient) {
  }

  changeLanguageMessage(message) {
    this.changeLanguage.next(message);
    this.translate.use(message || 'en');
    window.localStorage.setItem('lang', message);
  }

  getSellerDetail(sellerId) {
    return this.http.get('/seller/detail/' + sellerId);
  }

  getPreviousMonths(numberOfDays, numberOfMonths) {
    const currentDate = new Date();
    let startingDate;
    if (numberOfMonths) {
      startingDate = moment(currentDate).subtract(numberOfMonths, 'months').format('YYYY-MM-DD');
    } else {
      startingDate = moment(currentDate).subtract(numberOfDays, 'day').format('YYYY-MM-DD');
    }
    return startingDate;
  }

}
