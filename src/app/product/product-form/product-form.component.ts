
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProductService } from '../service/product.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareModuleService } from '../../share/service/share-module.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  specialityList = [];
  selectedCountryId;
  selectedLanguageId;
  breadcrumbOption: MenuItem[];
  homeIcon: MenuItem;
  newProductForm: FormGroup;
  newVariantForm: FormGroup;
  submitted = false;
  variantSubmitted = false;
  productImages = [];
  catalogImages = [];
  editProductImages = [];
  editCatalogImages = [];
  closeResult = '';
  dropdownBinding = {};
  errorMessage = {};
  conditions = {};
  editProductId = null;
  liveProductId = null;
  sellerDetails = {};
  defaultSellerValue = {};
  ckeConfig: any;
  productStatus = '';
  rejectionMsg = '';
  PNCodeObj = {
    product: '',
    productVariant: [],
  };
  PnCodeArr = [];
  sellerFees;
  convertHTML;
  defaultHtml = "-";
  finalData;
  defaultImageFileName = '';
  @ViewChild('productFileInput') productFileInput;
  @ViewChild('catelogFileInput') catelogFileInput;
  deletedVariant = [];
  deletedProductImages = [];
  deletedCatalog = [];
  defaultImageBeforeSave = null;
  livePageDeliveryTime = null;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private sharedService: ShareModuleService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {

    this.convertHTML = this.sanitizer;
    this.breadcrumbOption = [
      { label: 'Product', routerLink: '/product' },
      { label: 'Add', routerLink: '/product/new' }
    ];
    this.homeIcon = { icon: 'pi pi-home', routerLink: '/product' };
    this.errorMessage = {
      PNCDE_errorMessage: '',
      PNCDE_errorMessage_variant: '',
      PNCDE_successMessage: '',
      PNCDE_successMessage_variant: '',
      catalogError: '',
      imageError: ''
    };
    this.conditions = {
      isValidatePN: false,
      isValidatePNForVariant: false,
      disablePrice: false,
      disableComparePrice: true,
      disableVariantComparePrice: true,
      displayTable: false,
      isEditPage: false,
      isLivePage: false,
      isDuplicatePage: false,
      isEditPNCDE: false,
      isLoading: false
    }
    this.ckeConfig = {
      extraPlugins: 'uploadimage',
      uploadUrl:
        'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
      filebrowserBrowseUrl:
        'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html',
      filebrowserImageBrowseUrl:
        'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html?type=Images',
      filebrowserUploadUrl:
        'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files',
      filebrowserImageUploadUrl:
        'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images'
    };
  }

  ngOnInit() {
    this.getCountry();
    this.getSpecialityList();
    this.getCountryOriginList();
    this.initFormGroup();
    this.getSellerDetail();
    this.activeRoute.params.subscribe(paramsObj => {
      if (paramsObj[`productId`]) {
        this.conditions['isEditPage'] = true;
        this.editProductId = paramsObj[`productId`];
        this.getProductByProductId(paramsObj[`productId`]);
      } else if (paramsObj[`duplicatePID`]) {
        this.conditions['isDuplicatePage'] = true;
        this.editProductId = paramsObj[`duplicatePID`];
        this.getProductByProductId(paramsObj[`duplicatePID`]);
      } else if (paramsObj[`liveProductId`]) {
        this.conditions['isLivePage'] = true;
        this.liveProductId = paramsObj[`liveProductId`];
        this.getProductByProductId(paramsObj[`liveProductId`]);
      }
    });
  }

  initFormGroup() {
    let sellPrice = 0.00;
    let walletPrice = 0.00;
    this.newProductForm = this.formBuilder.group({
      countryId: new FormControl(null, Validators.compose([Validators.required])),
      languageId: new FormControl(null, Validators.compose([Validators.required])),
      productName: new FormControl(null, Validators.compose([Validators.required])),
      supplyTypeId: new FormControl(null, Validators.compose([Validators.required])),
      manufactureId: new FormControl(null, Validators.compose([Validators.required])),
      PNCDE: new FormControl('', Validators.compose([Validators.required])),
      categoryId: new FormControl(null, Validators.compose([Validators.required])),
      speciality: new FormControl(null),
      UOM: new FormControl(''),
      countryOriginId: new FormControl(null),
      isQuote: new FormControl(false),
      MRP: new FormControl('',
        Validators.compose([Validators.required,
        Validators.min(1),
        Validators.pattern(/^[1-9]\d*(\.\d+)?$/)])),
      sellPrice: new FormControl(sellPrice),
      walletPrice: new FormControl(walletPrice),
      noDiscount: new FormControl(false),
      isSale: new FormControl(false),
      shortDesciption: new FormControl(''),
      description: new FormControl(''),
      video: new FormControl(''),
      features: new FormControl(''),
      warranty: new FormControl('<p>Standard warranty covered by the seller against any manufacturing defect. In such events, please report to us within 7 days from the date of delivery at connect@lumiere32.my</p>'),
      isPackage: new FormControl(false),
      productVariants: this.formBuilder.array([]),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeyword: new FormControl(''),
      isQuantityDiscount: new FormControl(false),
      quantityDiscounts: new FormControl(''),
      sellerProducts: this.setSellerData({}),
      sellerId: new FormControl(localStorage.getItem('sellerId') ? Number(localStorage.getItem('sellerId')) : '')
    });
    this.newVariantFormInit();

  }

  async setProductDetail(controlValue) {

    let selectedValues = {};
    this.conditions['isValidatePN'] = true;

    selectedValues['selectedCountry'] = await this.setDropdownValue(this.dropdownBinding['countries'], controlValue['countryId']);
    this.selectedCountryId = controlValue['country']['id'];
    this.selectedLanguageId = controlValue['language']['id'];
    if (selectedValues['selectedCountry']) {
      await this.getLanguage(selectedValues['selectedCountry']['value']);
      await this.getSupplyType(selectedValues['selectedCountry']['value']);
      await this.getManufacturerBrands(selectedValues['selectedCountry']['value']);
    }

    selectedValues['selectedLanguage'] = await this.setDropdownValue(this.dropdownBinding['languages'], controlValue['languageId']);

    if (selectedValues['selectedLanguage']['value'] && selectedValues['selectedCountry']['value']) {
      await this.getCategoryList(selectedValues['selectedLanguage']['value'], selectedValues['selectedCountry']['value']);
    }

    selectedValues['selectedSupplyTypes'] = await this.setDropdownValue(this.dropdownBinding['supplyTypes'], controlValue['supplyTypeId']);
    selectedValues['selectedManufacturerBrands'] = await this.setDropdownValue(this.dropdownBinding['manufacturerBrands'], controlValue['manufactureId']);
    selectedValues['selectedCategories'] = await this.setDropdownValue(this.dropdownBinding['categories'], controlValue['categoryId']);
    selectedValues['selectedCountryOriginList'] = await this.setDropdownValue(this.dropdownBinding['countryOriginList'], controlValue['countryOriginId']);
    selectedValues['specialityList'] = await this.setDropdownValue(this.specialityList, controlValue['speciality']);

    this.PnCodeArr[0] = controlValue['PNCDE'];
    if ((this.conditions['isEditPage'] || this.conditions['isLivePage']) && !this.conditions['isDuplicatePage']) {
      this.editProductImages = [...controlValue['productImage']];
    }

    if (this.conditions['isLivePage']) {
      this.livePageDeliveryTime = controlValue['sellerProducts'][0]['deliveryTime'];
    }

    let productVariant = controlValue['productVariants'];
    if (productVariant && productVariant.length > 0) {
      this.conditions['displayTable'] = true;
      productVariant.forEach(variant => {
        this.newVariantFormInit(variant);
        this.variantDetail.push(this.newVariantForm);
        this.PnCodeArr.push(variant['PNCDE']);
        // this.newVariantFormInit();
      });
    }

    if (controlValue['catelogue']) {
      this.editCatalogImages.push(controlValue['catelogue']);
    }

    await this.newProductForm.patchValue({
      languageId: selectedValues['selectedLanguage'],
      supplyTypeId: selectedValues['selectedSupplyTypes'],
      manufactureId: selectedValues['selectedManufacturerBrands'],
      categoryId: selectedValues['selectedCategories'],
      speciality: (
        Object.keys(selectedValues['specialityList']).length === 0) ? null : selectedValues['specialityList'],
      countryOriginId: selectedValues['selectedCountryOriginList'],
      countryId: selectedValues['selectedCountry'],
      productName: controlValue['productName'],
      PNCDE: (!this.conditions['isDuplicatePage'] ? controlValue['PNCDE'] : ''),
      UOM: (controlValue['UOM'] === null || controlValue['UOM'] === 'null') ? '' : controlValue['UOM'],
      isQuote: controlValue['isQuote'],
      MRP: ((controlValue['MRP'] === 0.00 || controlValue['MRP'] === '0.00'
        || controlValue['MRP'] == 0) ? '' : Number(controlValue['MRP'])),
      isSale: controlValue['isSale'],
      sellPrice: controlValue['sellPrice'],
      walletPrice: controlValue['walletPrice'],
      noDiscount: controlValue['noDiscount'],
      shortDesciption: (controlValue['shortDesciption']) ? controlValue['shortDesciption'] : '',
      description: controlValue['description'],
      video: controlValue['video'],
      features: controlValue['features'],
      warranty: controlValue['warranty'],
      isPackage: controlValue['isPackage'],
      metaTitle: controlValue['metaTitle'],
      metaDescription: controlValue['metaDescription'],
      metaKeyword: controlValue['metaKeyword'],
      isQuantityDiscount: controlValue['isQuantityDiscount'],
      quantityDiscounts: '',
      sellerProducts: (controlValue && controlValue['sellerProducts'].length > 0) ? controlValue['sellerProducts'][0] : {},
      sellerId: localStorage.getItem('sellerId') ? Number(localStorage.getItem('sellerId')) : '',
    });

    if (controlValue['isSale']) {
      this.conditions['disableComparePrice'] = false;
    } else {
      this.conditions['disableComparePrice'] = true;
    }

    if (controlValue['isPackage']) {
      this.conditions['displayTable'] = true;
    } else {
      this.conditions['displayTable'] = false;
    }

    if (controlValue['isQuote']) {
      this.conditions['disablePrice'] = true;
      this.f['MRP'].setValue('');
      this.f['MRP'].clearValidators();
      this.f['MRP'].updateValueAndValidity();
    }
  }

  getSellerDetail() {
    this.sharedService.getSellerDetail(Number(localStorage.getItem('sellerId'))).toPromise().then(res => {
      if (res && res['data']) {
        window.localStorage.setItem('sellerFee', res['data']['sellerFee']);
        this.sellerFees = res['data']['sellerFee'];
      }
    }).catch(err => { });
  }

  setSellerData(controlValue?: any) {
    return this.formBuilder.group({
      id: new FormControl((controlValue && controlValue['id'] &&
        (this.conditions['isEditPage'] || this.conditions['isLivePage']) &&
        !this.conditions['isDuplicatePage'] ? controlValue['id'] : '')),
      quantity: new FormControl(controlValue && controlValue['quantity'], Validators.compose([Validators.required,
      Validators.min(1),
      Validators.pattern(/^[1-9]\d*$/)])),
      deliveryTime: new FormControl(controlValue && controlValue['deliveryTime'] || 0)
    });
  }

  getProductByProductId(id) {
    if (!this.conditions['isLivePage']) {
      this.productService.getProductById(id).toPromise().then(async (res) => {
        if (res && res['success'] && res['data']) {
          await this.setProductDetail(res['data']);
          this.productStatus = res['data']['approvedStatus'];
          this.rejectionMsg = res['data']['rejectionMessage'];
        }
      }).catch(err => { });
    } else {
      this.productService.getLiveProductById(id).toPromise().then((res) => {
        if (res && res['success'] && res['data']) {
          this.setProductDetail(res['data']);
          this.productStatus = res['data']['approvedStatus'];
          this.rejectionMsg = res['data']['rejectionMessage'];
        }
      }).catch(err => { });
    }
  }

  async getCountry() {
    await this.productService.getCountry().toPromise().then((res) => {
      if (res && res['success'] && res['data'].length > 0) {
        this.dropdownBinding['countries'] = this.productService.arrayOfStringsToArrayOfObjects(res.data);
      } else {
        this.dropdownBinding['countries'] = [];
      }
    }).catch(err => { this.dropdownBinding['countries'] = []; });
  }

  OnCountryChange(event) {
    if (event.value && event['value']['value']) {
      this.errorMessage['PNCDE_errorMessage'] = '';
      const countryId = event['value']['value'];
      this.selectedCountryId = countryId;
      this.getLanguage(countryId);
      this.getSupplyType(countryId);
      this.getManufacturerBrands(countryId);
    }
  }

  async getLanguage(selectedCountryId) {
    await this.productService.getCountryLanguage(selectedCountryId).toPromise().then(async (res) => {
      this.dropdownBinding['languages'] = await this.productService.arrayOfStringsToArrayOfObjects(res['data']);
    }).catch(err => { this.dropdownBinding['languages'] = []; })
  }

  OnLanguageChange(event) {
    if (event.value && event['value']['value'] && this.selectedCountryId) {
      this.errorMessage['PNCDE_errorMessage'] = '';
      const languageId = event['value']['value'];
      this.getCategoryList(languageId, this.selectedCountryId);
    }
  }

  async getSupplyType(selectedCountryId) {
    await this.productService.getSupplyTypeList(selectedCountryId).toPromise().then((res) => {
      this.dropdownBinding['supplyTypes'] = this.productService.arrayOfStringsToArrayOfObjects(res['data']);
    }).catch(err => { })
  }

  async getManufacturerBrands(selectedCountryId) {
    await this.productService.getManufacturerList(selectedCountryId).toPromise().then((res) => {
      this.dropdownBinding['manufacturerBrands'] = this.productService.arrayOfStringsToArrayOfObjects(res['data']);
    }).catch(err => { })
  }

  async getCategoryList(selectedLanguageId, selectedCountryId) {
    await this.productService.getCategory(selectedLanguageId, selectedCountryId, false).toPromise().then((res) => {
      this.dropdownBinding['categories'] = this.productService.arrayOfStringsToArrayOfObjects(res['data']);
    }).catch(err => { })
  }

  async getCountryOriginList() {
    await this.productService.getCountryOrigin().toPromise().then((res) => {
      this.dropdownBinding['countryOriginList'] = this.productService.arrayOfStringsToArrayOfObjects(res['data']);
    }).catch(err => { })
  }

  async getSpecialityList() {
    await this.productService.getSpeciality().toPromise().then((res) => {
      if (res && res['data'] && res['data']['result']) {
        res['data']['result'].forEach(element => {
          this.specialityList.push({
            label: element.specialityName,
            value: element.id
          });
        });
      }
    }).catch(err => { })
  }

  // Add/remove validation for price
  onSelectQuote(event) {
    if (event.target.checked) {
      this.conditions['disablePrice'] = true
      this.f['MRP'].setValue('');
      this.f['MRP'].clearValidators();
    } else {
      this.conditions['disablePrice'] = false
      this.f['MRP'].setValue('');
      this.f['MRP'].setValidators([Validators.required,
      Validators.min(1),
      Validators.pattern(/^[1-9]\d*(\.\d+)?$/)]);
    }
    this.f['MRP'].updateValueAndValidity();
  }

  get f() { return this.newProductForm.controls; }

  get variantForm() { return this.newVariantForm.controls; }

  get variantDetail(): FormArray { return this.newProductForm.get('productVariants') as FormArray; }

  newVariantFormInit(variantDetail: any = {}) {
    this.newVariantForm = this.formBuilder.group({
      productName: new FormControl(variantDetail['productName'] || '', Validators.compose([Validators.required])),
      PNCDE: new FormControl(variantDetail['PNCDE'] || '', Validators.compose([Validators.required])),
      quantity: new FormControl((variantDetail['sellerProducts'] &&
        variantDetail['sellerProducts'][0]['quantity']) ? Number(variantDetail['sellerProducts'][0]['quantity']) : '',
        Validators.compose([Validators.required,
        Validators.min(1),
        Validators.pattern(/^[1-9]\d*$/)])),
      packageContent: new FormControl(variantDetail['packageContent'] || ''),
      MRP: new FormControl(Number(variantDetail['MRP']) || '',
        Validators.compose([Validators.required,
        Validators.min(1),
        Validators.pattern(/^[1-9]\d*(\.\d+)?$/)])),
      walletPrice: new FormControl((variantDetail['sellerProducts'] && variantDetail['sellerProducts'][0]['walletPrice']) ? Number(variantDetail['sellerProducts'][0]['walletPrice']) : 0),
      deliveryTime: new FormControl((variantDetail['sellerProducts'] && variantDetail['sellerProducts'][0]['deliveryTime']) ? Number(variantDetail['sellerProducts'][0]['deliveryTime']) : 0),
      isSale: new FormControl(variantDetail['isSale'] || false),
      isQuote: new FormControl(variantDetail['isQuote'] || false),
      sellPrice: new FormControl(variantDetail['sellPrice'] || 0),
      // sellerProducts: this.setSellerData((variantDetail['sellerProducts'] && (variantDetail['sellerProducts'].length > 0)) ? variantDetail['sellerProducts'][0] : {})
      sellerProducts: (variantDetail['sellerProducts'] && (variantDetail['sellerProducts'].length > 0)) ? variantDetail['sellerProducts'][0] : {}
    });

    if (variantDetail['id'] && !this.conditions['isDuplicatePage']) {
      this.newVariantForm.addControl('id', new FormControl(variantDetail['id']));
    }
  }

  onSelectVariant(event) {
    if (event.target.checked) {
      this.conditions['displayTable'] = true;
    } else {
      this.conditions['displayTable'] = false;
    }
  }

  saveVariant() {
    this.variantSubmitted = true;
    if (!this.newVariantForm.valid || this.errorMessage['PNCDE_errorMessage_variant'] !== '') {
      return;
    }
    if (!this.conditions['isValidatePNForVariant']) {
      this.errorMessage['PNCDE_errorMessage_variant'] = 'Please validate code';
      return
    }
    this.conditions['isValidatePNForVariant'] = true;
    this.errorMessage['PNCDE_errorMessage_variant'] = '';
    this.modalService.dismissAll();
    this.variantDetail.push(this.newVariantForm);
    this.PNCodeObj['productVariant'].push(this.newVariantForm.value['PNCDE']);
    this.newVariantFormInit();
  }

  removeVariants(myControl) {
    if (myControl && myControl.value.id && ((this.conditions['isEditPage'] && !this.conditions['isLivePage']) || this.conditions['isDuplicatePage'])) {
      this.deletedVariant.push(myControl.value.id);
      // this.productService.deleteProductVariant(myControl.value.id).toPromise().then(res => {
      //   if (res['success']) {
      //     (<FormArray>(this.variantDetail)).removeAt(this.variantDetail.controls.findIndex(control => control === myControl));
      //   }
      // }).catch(err => { });
    }
    (<FormArray>(this.variantDetail)).removeAt(this.variantDetail.controls.findIndex(control => control === myControl));
  }

  selectSellPrice(event) {
    this.f['isSale'].setValue(event.target.checked);
    if (event.target.checked) {
      this.conditions['disableComparePrice'] = false;
      this.f['walletPrice'].setValue(0);
    } else {
      this.conditions['disableComparePrice'] = true;
    }
  }

  selectVariantSellPrice(event) {
    if (event.target.checked) {
      this.conditions['disableVariantComparePrice'] = false;
    } else {
      this.conditions['disableVariantComparePrice'] = true;
    }
  }

  PNCDE_Check(mainProduct, newValue) {
    const countryError = 'Select Country First';
    const languageError = 'Select Language First';
    const IsExistError = 'Entered SKU/ PN CDE already exists';
    const requiredField = 'Please enter SKU/PN CDE';
    const selectedLanguageId = this.f['languageId']['value'];
    let reqParams = {};

    if (this.f['countryId']['invalid']) {
      (mainProduct) ?
        this.errorMessage['PNCDE_errorMessage'] = countryError : this.errorMessage['PNCDE_errorMessage_variant'] = countryError;
    } else if (this.f['languageId']['invalid'] && !selectedLanguageId) {
      (mainProduct) ?
        this.errorMessage['PNCDE_errorMessage'] = languageError : this.errorMessage['PNCDE_errorMessage_variant'] = languageError;
    } else if (!newValue && this.f['countryId'].value != undefined && selectedLanguageId != undefined) {
      (mainProduct) ?
        this.errorMessage['PNCDE_errorMessage'] = requiredField : this.errorMessage['PNCDE_errorMessage_variant'] = requiredField;
    } else if (newValue && this.f['countryId'].value != undefined && selectedLanguageId != undefined) {
      const existPnCode = this.PnCodeArr.find(pnCode => pnCode === newValue);
      if (existPnCode) {
        if (mainProduct && this.PnCodeArr[0] && newValue !== this.PnCodeArr[0]) {
          this.errorMessage['PNCDE_errorMessage'] = IsExistError;
        } else {
          this.errorMessage['PNCDE_errorMessage_variant'] = IsExistError;
        }
        return;
      } else {

        if (mainProduct) {
          this.errorMessage['PNCDE_errorMessage'] = '';
          this.PnCodeArr[0] = newValue;
        } else {
          this.errorMessage['PNCDE_errorMessage_variant'] = '';
          this.PnCodeArr.push(newValue);
        }

        if (this.editProductId) {
          reqParams = {
            countryId: this.selectedCountryId,
            languageId: this.selectedLanguageId,
            PNCDE: newValue,
            productId: this.editProductId
          };
        } else {
          reqParams = {
            countryId: this.selectedCountryId,
            languageId: selectedLanguageId,
            PNCDE: newValue
          };
        }

        this.productService.onCheckPnCode(reqParams).toPromise().then((res) => {
          if (res && res['success']) {
            if (mainProduct) {
              this.errorMessage['PNCDE_errorMessage'] = '';
              this.conditions['isValidatePN'] = true;
              this.errorMessage['PNCDE_successMessage'] = 'Entered SKU/ PN CDE is valid';
            } else {
              this.conditions['isValidatePNForVariant'] = true;
              this.errorMessage['PNCDE_errorMessage_variant'] = '';
              this.errorMessage['PNCDE_successMessage_variant'] = 'Entered SKU/ PN CDE is valid';
            }
          }
        }).catch(err => {
          if (mainProduct) {
            this.conditions['isValidatePN'] = false;
            this.f['PNCDE'].setValue('');
            this.errorMessage['PNCDE_errorMessage'] = 'Entered SKU/ PN CDE already exists';
          } else {
            this.variantForm['PNCDE'].setValue('');
            this.conditions['isValidatePNForVariant'] = false;
            this.errorMessage['PNCDE_errorMessage_variant'] = 'Entered SKU/ PN CDE already exists';
          }
        });
      }
    }
  }

  PNCodeChange(isMainFormPNCDE) {
    if (isMainFormPNCDE) {
      this.errorMessage['PNCDE_errorMessage'] = '';
      this.errorMessage['PNCDE_successMessage'] = '';
      this.conditions['isValidatePN'] = false;
    } else {
      this.errorMessage['PNCDE_errorMessage_variant'] = '';
      this.conditions['isValidatePNForVariant'] = false;
      this.errorMessage['PNCDE_successMessage_variant'] = '';
    }
  }

  onFileChange(event, controlType, resetEvent) {

    if (event.target && event.target.files) {
      let newFiles = event.target.files;
      let fileLength = newFiles.length;
      if (newFiles) {

        this.errorMessage['catalogError'] = '';
        this.errorMessage['imageError'] = '';

        for (let i = 0; i < fileLength; i++) {

          const mimeType = newFiles[i].type;
          const fileSize = newFiles[i].size;
          const fileName = newFiles[i].name;

          if (controlType === 'catalog') {
            if (mimeType && mimeType === 'application/pdf') {
              if (fileSize < 200000) {
                let reader = new FileReader();
                reader.onload = (subEvent: any) => {
                  this.catalogImages.push({ image: subEvent.target.result, imgName: fileName });
                }
                reader.readAsDataURL(newFiles[i]);
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: `File size should not exceed 200kb. ${fileName} Size is too large!` });
                resetEvent.value = "";
              }
            } else {
              this.errorMessage['catalogError'] = 'Please select PDF file';
              resetEvent.value = "";
            }
          }

          if (controlType === 'PImages') {
            if (mimeType && (mimeType === 'image/png' || mimeType === 'image/jpeg')) {
              if (fileSize < 200000) {

                if (this.productImages && this.productImages.length > 0) {
                  const isImageNameExist = this.productImages.find((data) => data.imgName === fileName);
                  if (!isImageNameExist || isImageNameExist === undefined) {
                    const reader = new FileReader();
                    reader.onload = (subEvent: any) => {
                      this.productImages.push({ image: subEvent.target.result, imgName: fileName });
                      this.errorMessage['imageError'] = '';
                    }
                    reader.readAsDataURL(newFiles[i]);
                  } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: `File name already exist. Please change the file name - ${fileName} and try again.` });
                  }
                } else {
                  const reader = new FileReader();
                  reader.onload = (subEvent: any) => {
                    this.productImages.push({ image: subEvent.target.result, imgName: fileName });
                    this.errorMessage['imageError'] = '';
                  }
                  reader.readAsDataURL(newFiles[i]);
                }
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: `File size should not exceed 200kb. ${fileName} Size is too large!` });
              }
            } else {
              this.errorMessage['imageError'] = 'Please select png or jpeg images';
            }
          }
        }
      }
    }
    this.productFileInput.nativeElement.value = '';
    this.catelogFileInput.nativeElement.value = '';
  }

  PNCDE_Edit() {
    this.conditions['isValidatePN'] = false;
    this.conditions['isEditPNCDE'] = true;
  }

  deleteProductImage(index, imageUploadType, imgData) {
    this.defaultImageFileName !== ''
    if (imageUploadType === 'new') {
      this.productImages.splice(index, 1);
      if (this.productImages && this.productImages.length === 1) {
        const fileName = this.productImages[0].imgName;
        this.defaultImageFileName = fileName;
      }
    } else if (imageUploadType === 'uploaded') {
      const imgObj = {
        fileURL: imgData['image'],
        id: imgData['id']
      };
      this.editProductImages.splice(index, 1);
      this.deletedProductImages.push(imgObj);
      // this.productService.deleteProductImage(imgObj).toPromise().then(res => {
      //   if (res) {
      //     this.editProductImages.splice(index, 1);
      //   }
      // }).catch(err => { });
    } else if (imageUploadType === 'imgCatalog') {
      this.catalogImages.splice(index, 1);
    }
    else if (imageUploadType === 'uploadedCatalog') {
      const catalogObj = {
        fileURL: imgData,
        id: 0,
        productId: this.editProductId
      };
      this.editCatalogImages.splice(index, 1);
      this.deletedCatalog.push(catalogObj);
      // this.productService.deleteProductImage(catalogObj).toPromise().then(res => {
      //   if (res) {
      //     this.editCatalogImages.splice(index, 1);
      //   }
      // }).catch(err => { });
    }
  }

  onSubmit(productFormValid) {
    this.submitted = true;

    if ((!this.conditions['isEditPage'] && !this.conditions['isLivePage'])
      && this.productImages && this.productImages.length === 1) {
      const fileName = this.productImages[0]['imgName'];
      this.productImages[0]['isDefault'] = true;
      this.defaultImageFileName = fileName;
    }

    let formValues = JSON.parse(JSON.stringify(this.newProductForm.value));
    if (!productFormValid) {
      return;
    }

    if ((this.productImages && this.productImages.length === 0) && (this.editProductImages && this.editProductImages.length === 0)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please upload product image!' });
      this.errorMessage['imageError'] = "Please upload product image";
      return;
    }

    if (!this.conditions['isValidatePN'] && !this.conditions['isLivePage']) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Validate PN CDE!' });
      return;
    }

    if (this.conditions['displayTable'] && formValues['productVariants'] && formValues['productVariants'].length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please uncheck the "Product has multiple option" checkbox in variant section as this product has no variants' });
      return;
    }

    if ((!this.conditions['isEditPage'] && !this.conditions['isLivePage']) || this.conditions['isDuplicatePage']) {
      if (this.defaultImageFileName && this.defaultImageFileName !== '') {
        formValues['defaultImage'] = this.defaultImageFileName;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select default product image! Click on that image to set as default image.' });
        return;
      }
    }

    if (this.conditions['isEditPage']) {
      const isDefaultImageSet = this.editProductImages.find((data) => data.isDefault === true);
      if (this.defaultImageFileName !== '') {
        formValues['defaultImage'] = this.defaultImageFileName;
      } else if (isDefaultImageSet === undefined && this.defaultImageFileName == '') {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select default product image! Click on that image to set as default image.' });
        return;
      }
    }

    formValues['countryId'] = formValues['countryId']['value'];
    formValues['languageId'] = formValues['languageId']['value'];
    formValues['supplyTypeId'] = formValues['supplyTypeId']['value'];
    formValues['categoryId'] = formValues['categoryId']['value'];
    formValues['manufactureId'] = formValues['manufactureId']['value'];
    formValues['speciality'] = (formValues['speciality'] && formValues['speciality']['label']) ? formValues['speciality']['label'] : '';
    formValues['countryOriginId'] = (formValues['countryOriginId'] && formValues['countryOriginId']['value']) ? formValues['countryOriginId']['value'] : '';
    if (formValues['MRP'] == '' || !formValues['MRP']) {
      formValues['MRP'] = 0;
    }

    if (formValues['productVariants'] && formValues['productVariants'].length > 0) {

      formValues['productVariants'].forEach((varDetail) => {
        const sellerObj = {
          quantity: varDetail['quantity'] || '',
          deliveryTime: varDetail['deliveryTime'] || ''
        };
        if (varDetail['id'] && !this.conditions['isDuplicatePage']) {
          sellerObj['id'] = (varDetail['sellerProducts'] && varDetail['sellerProducts']['id']) ? varDetail['sellerProducts']['id'] : undefined;
        }
        varDetail.sellerProducts = sellerObj;
      });

      const res = this.productService.addOtherKeysToVarientEdit1(
        formValues['productVariants']
      );
      if (res && res.length > 0) {
        formValues['productVariants'] = JSON.stringify(res);
      }
    } else {
      formValues['productVariants'] = '';
    }

    if (formValues['sellPrice'] != 0) {
      const discount = Math.round((+formValues['sellPrice'] - +formValues['MRP']) / +formValues['sellPrice'] * 100);
      formValues['discount'] = (discount > 0) ? discount : 0;
    } else {
      formValues['discount'] = 0;
    }

    if (formValues['sellerProducts'] && formValues['sellerProducts']['id'] === null || formValues['sellerProducts']['id'] === '' || this.conditions['isDuplicatePage']) {
      delete formValues['sellerProducts']['id'];
    }

    formValues['sellerProducts'] = JSON.stringify(formValues['sellerProducts']);
    formValues['sellerFee'] = (window.localStorage.getItem('sellerFee'));

    if ((this.conditions['isEditPage'] &&
      this.editProductId && !this.conditions['isDuplicatePage']) ||
      (this.conditions['isLivePage'] && this.liveProductId)) {

      if (this.editProductId) {
        formValues['id'] = this.editProductId;
      }
      if (this.liveProductId) {
        formValues['id'] = this.liveProductId;
        for (let formKey in formValues) {
          if (formKey !== 'id' && formKey !== 'productVariants' && formKey !== 'sellerProducts') {
            delete formValues[formKey];
          }
        }
      }
    }

    const formData = new FormData();
    const dataForBackend = { ...formValues };

    for (const key in dataForBackend) {
      if ((key !== 'file')) {
        formData.append(key, dataForBackend[key]);
      }
    }

    if (this.productImages.length > 0) {
      this.productImages.forEach((img) => {
        const fileName = img.imgName;
        let fileURL = img.image;
        formData.append('file[]', this.dataURLtoFile(fileURL, fileName), fileName);
      });
    }

    if (this.catalogImages.length > 0) {
      this.catalogImages.forEach((img) => {
        const fileName = img.name;
        let fileURL = img.image;
        formData.append('catelogue', this.dataURLtoFile(fileURL, fileName), fileName);
      });
    }

    this.finalData = formData;
    this.showConfirm();
  }

  callDeletedItemsAPI() {

    return new Promise((resolve, reject) => {
      if (this.deletedVariant.length > 0) {
        this.deletedVariant.forEach(variant => {
          this.productService.deleteProductVariant(variant).toPromise();
        });
      }
      if (this.deletedProductImages.length > 0) {
        this.deletedProductImages.forEach(productImg => {
          this.productService.deleteProductImage(productImg).toPromise();
        });
      }
      if (this.deletedCatalog.length > 0) {
        this.deletedCatalog.forEach(catalog => {
          this.productService.deleteProductImage(catalog).toPromise();
        });
      }
      if (this.defaultImageBeforeSave) {
        this.productService.defaultImage(this.defaultImageBeforeSave).toPromise();
      }
      resolve(true);
    });
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ severity: 'info', key: 'c', sticky: true, summary: 'Are you sure?', detail: 'Confirm to proceed' });
    this.conditions['isLoading'] = true;
  }

  async onConfirm() {
    this.conditions['isLoading'] = true;
    await this.callDeletedItemsAPI();
    this.messageService.clear('c');
    this.productService.addProduct(this.finalData, this.conditions['isLivePage']).toPromise().then((res) => {
      if (res && res['success']) {
        this.conditions['isLoading'] = false;
        if ((!this.conditions['isEditPage'] && !this.conditions['isLivePage']) || this.conditions['isDuplicatePage']) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added successfully!' });
          this.router.navigate(['/product']);
        } else if (this.conditions['isLivePage']) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Live Product Quantity updated successfully!' });
          this.router.navigate(['/product/live']);
        } else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product updated successfully!' });
          this.router.navigate(['/product']);
        }
      }
    }).catch(err => {
      this.conditions['isLoading'] = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong please try again' });
    })
  }

  onReject() {
    this.messageService.clear('c');
    this.conditions['isLoading'] = false;
  }

  setDropdownValue(arr: any[], id) {
    const newOBJ = {};
    if (arr && arr.length > 0) {
      arr.forEach(element => {
        if (element['value'] === id || element['label'] === id) {
          newOBJ['label'] = element.label;
          newOBJ['value'] = element.value;
        }
      });
    }
    return newOBJ;
  }

  dataURLtoFile(dataURL, filename) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  changeDefaultImage(isDefault: boolean, productId, id, imageIndex) {
    this.defaultImageFileName = '';
    // let defaultData = { id: id, productId: productId, isDefault: isDefault };
    this.defaultImageBeforeSave = { id: id, productId: productId, isDefault: isDefault };
    // this.productService.defaultImage(defaultData).toPromise().then(res => {
    //   if (res && res['success']) {
    this.editProductImages.forEach((element, index) => {
      if (index == imageIndex) {
        element.isDefault = true;
      }
      else {
        element.isDefault = false;
      }
    });
    // }
    // });
  }

  setDefaultImage(index) {
    this.defaultImageFileName = this.productImages[index]['imgName'];
    this.productImages.forEach((img, i) => {
      if (index === i) {
        img['isDefault'] = true;
      } else {
        img['isDefault'] = false;
      }
    });

    if (this.conditions['isEditPage'] && this.editProductImages.length > 0) {
      this.editProductImages.forEach((uploadedImg, index) => {
        if (uploadedImg['isDefault']) {
          this.defaultImageBeforeSave = { id: uploadedImg['id'], productId: uploadedImg['productId'], isDefault: false };
          // let defaultData = { id: uploadedImg['id'], productId: uploadedImg['productId'], isDefault: false };
          // this.productService.defaultImage(defaultData).toPromise().then(res => {
          //   if (res && res['success']) {
          //     this.editProductImages[index]['isDefault'] = false;
          //   }
          // });
        }
      });
    }
  }

  openPopup(content) {
    this.variantSubmitted = false;
    // this.newVariantForm.reset();
    this.newVariantFormInit();
    this.errorMessage['PNCDE_errorMessage_variant'] = '';
    this.errorMessage['PNCDE_successMessage_variant'] = '';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onClickBack() {
    if (this.conditions['isEditPage'] || this.conditions['isDuplicatePage'] || !this.conditions['isLivePage']) {
      this.router.navigate(['/product']);
    } else {
      this.router.navigate(['/product/live']);
    }
  }

}
