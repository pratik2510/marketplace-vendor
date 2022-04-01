import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private http: HttpClient
  ) { }

  // getAllOrder(pageNo, selectedDateRange) {
  getAllOrder(formValue) {
    const queryParams = { page: formValue['currentPage']  , searchKey : formValue['searchKey']};
    if (formValue['selectedDate']  && formValue['selectedDate'] .length === 1) {
      queryParams['start_date'] = (formValue['selectedDate'] [0]) ? moment(formValue['selectedDate'] [0]).format('YYYY-MM-DD') : '';
    } else if (formValue['selectedDate']  && formValue['selectedDate'] .length === 2) {
      queryParams['start_date'] = (formValue['selectedDate'] [0]) ? moment(formValue['selectedDate'] [0]).format('YYYY-MM-DD') : '';
      queryParams['end_date'] = (formValue['selectedDate'] [1]) ? moment(formValue['selectedDate'] [1]).format('YYYY-MM-DD') : '';
    }

    return this.http.get('/seller/myOrders/' + (window.localStorage.getItem('sellerId')), { params: queryParams });
  }

  downloadPO(orderId) {
    const headers = new HttpHeaders({ 'Content-Type': 'text/xml' });
    headers.append('Accept', 'html/xml');
    // headers.append('Content-Type', 'text/xml');
    const queryParams = { orderId: orderId };
    return this.http.get('/seller/myOrderPO/' + (window.localStorage.getItem('sellerId')),
      {
        headers: headers,
        params: queryParams,
        responseType: 'text'
      });
  }

}
