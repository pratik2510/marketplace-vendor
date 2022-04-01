import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userProfileForm: FormGroup;
  submitted = false;
  isDataLoad = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getSellerDetail();
  }

  getSellerDetail() {
    this.authService.getSellerDetail().toPromise().then((res) => {
      if (res && res['success']) {
        this.initFormGroup(res['data']);
        this.isDataLoad = true;
      }
    }).catch(err => { });
  }

  get f() { return this.userProfileForm.controls; }

  initFormGroup(sellerData) {
    let ccEmailArray = [];
    if (sellerData['ccEmail']) {
      const isCommaIncludes = sellerData['ccEmail'].includes(',');
      if (!isCommaIncludes) {
        ccEmailArray.push(sellerData['ccEmail']);
      }
      if (isCommaIncludes) {
        ccEmailArray = sellerData['ccEmail'].split(",")
      }
    }
    this.userProfileForm = this.formBuilder.group({
      id: new FormControl(sellerData['id'] || null),
      sellerName: new FormControl(sellerData['sellerName'] || null),
      sellerEmail: new FormControl(sellerData['sellerEmail'] || null),
      userName: new FormControl(sellerData['userName'] || null),
      mobileNo: new FormControl(sellerData['mobileNo'] || null, [
        Validators.required,
        Validators.pattern('^[0-9\+\-]{5,15}$')]),
      streetName: new FormControl(sellerData['streetName'] || null),
      floorNo: new FormControl(sellerData['floorNo'] || null),
      houseNo: new FormControl(sellerData['houseNo'] || null),
      buildingName: new FormControl(sellerData['buildingName'] || null),
      pickupAddress: new FormControl(sellerData['pickupAddress'] || null, Validators.compose([Validators.required])),
      pincode: new FormControl(sellerData['pincode'] || null, Validators.compose([Validators.required])),
      ccEmail: new FormControl(ccEmailArray)
    });
  }

  updateProfile(formValid) {
    this.submitted = true;
    if (!formValid) {
      return;
    }
    this.isLoading = true;
    const finalFormData = JSON.parse(JSON.stringify(this.userProfileForm.value));
    let ccEmail = finalFormData['ccEmail'];
    if (ccEmail && ccEmail.length > 0) {
      finalFormData['ccEmail'] = ccEmail.join(',');
    } else {
      finalFormData['ccEmail'] = '';
    }
    this.authService.editSellerDetail(finalFormData).toPromise().then((res) => {
      this.isLoading = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Your detail has been updated successfully!' });
    }).catch(err => {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
    });
  }

}
