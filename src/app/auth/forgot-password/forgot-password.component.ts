import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../service/auth.service';
import { ReCaptchaV3Service } from 'ngx-captcha';

@Component({
  selector: 'ngx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  submitted = false;
  apiError;
  isLoading = false;

  // Captcha Variants
  siteKey = "6LdDh3IaAAAAAHJ-drZTLx5cH2oJzkNXW24GaOeL"
  size: string = "normal";
  theme: string = "dark";
  type: string = "image";
  captchaIsLoaded = false;
  captchaSuccess = false;
  captchaIsExpired = false;
  captchaResponse = null;
  displayCaptchaError = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {
    this.reCaptchaV3Service.execute(this.siteKey, 'homepage', (token) => {
      console.log('This is your token: ', token);
    }, {
      useGlobalDomain: false
    });
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  handleSuccess(captchaResponse) {
    this.apiError = null;
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdRef.detectChanges();
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdRef.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdRef.detectChanges();
  }

  initFormGroup() {
    this.apiError = null;
    this.forgotPasswordForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([Validators.required])),
      recaptcha: new FormControl('')
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  forgotPassword(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }

    if (!this.captchaResponse) {
      this.apiError = 'Please complete the captcha verification step';
      return
    }

    this.isLoading = true;
    this.authService.recoverPassword(this.forgotPasswordForm.value).toPromise().then(response => {
      this.isLoading = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: response['message'] });
      this.router.navigateByUrl('/auth/login');
      this.apiError = null;
    }).catch(err => {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
    });
  }

  onChangeInput(event) {
    if (event && event.target.value) {
      this.apiError = null;
    }
  }

}
