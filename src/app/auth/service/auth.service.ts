import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSource = new BehaviorSubject('default');
  authStatus = this.authSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  changeAuthStatus(message) {
    this.authSource.next(message);
  }

  sellerLogin(reqData): any {
    return this.http.post('/seller/login', reqData, { observe: 'response' });
  }

  setToken(token) {
    localStorage.clear();
    window.localStorage.setItem('accessToken', token);
    this.changeAuthStatus('login');
  }

  checkUserLoggedIn() {
    if (localStorage.getItem('accessToken')) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.clear();
    this.changeAuthStatus('logout');
    this.router.navigateByUrl('/auth/login');
  }

  recoverPassword(data) {
    return this.http.post('/seller/requestForPassword', data);
  }

  changePassword(reqPayload) {
    return this.http.post('/seller/changePassword', reqPayload);
  }

  getSellerDetail() {
    return this.http.get('/seller/detail/' + (localStorage.getItem('sellerId')));
  }

  editSellerDetail(reqPayload) {
    return this.http.put('/seller/detail/', reqPayload);
  }

}
