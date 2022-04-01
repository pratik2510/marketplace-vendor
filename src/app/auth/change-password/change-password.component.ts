import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  submitted = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup() {
    this.changePasswordForm = this.formBuilder.group({
      id: new FormControl(Number(localStorage.getItem('sellerId')) || ''),
      userName: new FormControl(localStorage.getItem('userName') || ''),
      oldPassword: new FormControl('', Validators.compose([Validators.required])),
      newPassword: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  changePassword(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }
    this.isLoading = true;
    this.authService.changePassword(this.changePasswordForm.value).toPromise().then(response => {
      this.isLoading = false;
      if (response) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password Changed successfully!' });
        this.authService.logout();
      }
    }).catch(err => {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
    });
  }

}
