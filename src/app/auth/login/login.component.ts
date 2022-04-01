
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  apiError;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    const isLoggedIn = this.authService.checkUserLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup() {
    this.loginForm = this.formBuilder.group({
      userName: new FormControl('', Validators.compose([
        Validators.required])),
      password: new FormControl('', Validators.compose([
        Validators.required]))
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login(valid) {
    this.submitted = true;
    this.apiError = null;

    if (!valid) {
      return;
    }

    this.isLoading = true;
    this.authService.sellerLogin(this.loginForm.value).toPromise().then(response => {
      if (response && response.headers.get('AuthToken')) {
        this.isLoading = false;
        const responseData = response['body']['data'];
        localStorage.setItem('accessToken', response.headers.get('authtoken'));
        if (responseData) {
          localStorage.setItem('sellerId', responseData['id']);
          localStorage.setItem('countryId', responseData['countryId']);
          localStorage.setItem('sellerName', responseData['sellerName']);
          localStorage.setItem('userName', responseData['userName']);
          localStorage.setItem('symbol', responseData['country']['countryCurrency']['symbol']);
        }
        localStorage.setItem('userName', responseData['userName']);
        this.router.navigateByUrl('/pages/dashboard');
      }
    }).catch(err => {
      this.isLoading = false;
      if (err && err['error'] && err['error']['message']) {
        const apiStatus = err['error']['statusCode'];
        if (apiStatus === 403 || apiStatus === 400 ||
          apiStatus === 401 || apiStatus === 404) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }

  onChangeInput(event) {
    if (event && event.target.value) {
      this.apiError = null;
    }
  }

}