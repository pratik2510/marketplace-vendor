import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  
  getAllChartData(startDate) {
    const queryParams = {};
    queryParams['start_date'] = (startDate[0]) ? moment(startDate[0]).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
    queryParams['end_date'] = (startDate[1]) ? moment(startDate[1]).format('YYYY-MM-DD') : moment(startDate[0]).format('YYYY-MM-DD');
    return this.http.get('/seller/dashboard/' + window.localStorage.getItem('sellerId'), { params: queryParams });
  }


}
