// tslint:disable: max-line-length
// tslint:disable: trailing-comma
// tslint:disable: no-console
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProductService } from '../service/product.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareModuleService } from '../../share/service/share-module.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'ngx-add-product-v2',
    templateUrl: './add-product-v2.component.html',
    styleUrls: ['./add-product-v2.component.scss'],
    providers: [MessageService]
})
export class AddProductV2Component implements OnInit {

    specialityList = [];
    selectedCountryId = null;
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
    sellerFees = 0;
    convertHTML;
    finalData;
    defaultWarranty = '<p>Standard warranty covered by the seller against any manufacturing defect. In such events, please report to us within 7 days from the date of delivery at connect@lumiere32.my</p>';
    isFormPrepared = false;

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
            isEditPNCDE: false
        };
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
        this.populateIndependentDropdowns();
        this.getSpecialityList();
        this.getSellerDetail();
        this.activeRoute.params.subscribe(paramsObj => {
            if (paramsObj[`productId`]) {
                this.conditions['isEditPage'] = true;
                this.editProductId = paramsObj[`productId`];
                this.getProductByProductId(paramsObj[`productId`], this.conditions['isLivePage']);
            } else if (paramsObj[`duplicatePID`]) {
                // this.conditions['isEditPage'] = true;
                this.conditions['isDuplicatePage'] = true;
                this.editProductId = paramsObj[`duplicatePID`];
                this.getProductByProductId(paramsObj[`duplicatePID`], this.conditions['isLivePage']);
            } else if (paramsObj[`liveProductId`]) {
                this.conditions['isLivePage'] = true;
                this.liveProductId = paramsObj[`liveProductId`];
                this.getProductByProductId(paramsObj[`liveProductId`], this.conditions['isLivePage']);
            } else {
                this.prepareForm();
            }
        });
        this.sellerFees = Number(localStorage.getItem('sellerFee'));
    }

    populateIndependentDropdowns() {
        Promise.all([
            this.productService.getCountry().toPromise(),
            this.productService.getCountryOrigin().toPromise()
        ]).then(dropdownOptions => {
            this.dropdownBinding['countries'] = this.productService.arrayOfStringsToArrayOfObjects(dropdownOptions[0].data);
            this.dropdownBinding['countryOriginList'] = this.productService.arrayOfStringsToArrayOfObjects(dropdownOptions[1]['data']);
        }).catch(err => {
            this.dropdownBinding['countries'] = [];
            this.dropdownBinding['countryOriginList'] = [];
        });
    }

    OnCountryChange(event) {
        if (event.value && event['value']['value']) {
            this.errorMessage['PNCDE_errorMessage'] = '';
            const countryId = event['value']['value'];
            this.selectedCountryId = countryId;
            this.populateCountryBasedDropdowns(countryId);
            console.log(this.newProductForm.value);
        }
    }

    populateCountryBasedDropdowns(countryId) {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.productService.getCountryLanguage(countryId).toPromise(),
                this.productService.getSupplyTypeList(countryId).toPromise(),
                this.productService.getManufacturerList(countryId).toPromise()
            ]).then(dropdownOptions => {
                this.dropdownBinding['languages'] = this.productService.arrayOfStringsToArrayOfObjects(dropdownOptions[0]['data']);
                this.dropdownBinding['supplyTypes'] = this.productService.arrayOfStringsToArrayOfObjects(dropdownOptions[1]['data']);
                this.dropdownBinding['manufacturerBrands'] = this.productService.arrayOfStringsToArrayOfObjects(dropdownOptions[2]['data']);
                resolve(1);
            }).catch(err => {
                this.dropdownBinding['languages'] = [];
                this.dropdownBinding['supplyTypes'] = [];
                this.dropdownBinding['manufacturerBrands'] = [];
                resolve(1);
            });
        });
    }

    OnLanguageChange(event) {
        if (event.value && event['value']['value'] && this.selectedCountryId) {
            this.errorMessage['PNCDE_errorMessage'] = '';
            const languageId = event['value']['value'];
            this.populateLanguageBasedDropdowns(languageId, this.selectedCountryId);
        }
    }

    populateLanguageBasedDropdowns(languageId, countryId) {
        return new Promise((resolve, reject) => {
            this.productService.getCategory(languageId, countryId, false).toPromise().then((res) => {
                this.dropdownBinding['categories'] = this.productService.arrayOfStringsToArrayOfObjects(res['data']);
                resolve(1);
            }).catch(err => {
                this.dropdownBinding['categories'] = [];
                resolve(0);
            });
        });
    }

    getSellerDetail() {
        this.sharedService.getSellerDetail(+localStorage.getItem('sellerId')).toPromise().then(res => {
            if (res && res['data']) {
                localStorage.setItem('sellerFee', res['data']['sellerFee']);
                this.sellerFees = Number(localStorage.getItem('sellerFee'));
            }
        }).catch(err => { });
    }

    getSpecialityList() {
        this.productService.getSpeciality().toPromise().then((res) => {
            if (res && res['data'] && res['data']['result']) {
                res['data']['result'].forEach(speciality => {
                    this.specialityList.push({
                        label: speciality.specialityName,
                        value: speciality.id
                    });
                });
            }
        }).catch(err => { });
    }

    get f() { return this.newProductForm.controls; }

    get variantForm() { return this.newVariantForm.controls; }

    get variantDetail(): FormArray { return this.newProductForm.get('productVariants') as FormArray; }

    get sellerDetail(): FormArray { return this.newProductForm.get('sellerProducts') as FormArray; }

    async prepareForm(productData = {}) {
        this.newProductForm = this.formBuilder.group({
            countryId: new FormControl(null, Validators.compose([Validators.required])),
            languageId: new FormControl(null, Validators.compose([Validators.required])),
            supplyTypeId: new FormControl(null, Validators.compose([Validators.required])),
            manufactureId: new FormControl(null, Validators.compose([Validators.required])),
            categoryId: new FormControl(null, Validators.compose([Validators.required])),
            speciality: new FormControl(null),
            countryOriginId: new FormControl(null),
            productName: new FormControl(productData['productName'] || null, Validators.compose([Validators.required])),
            PNCDE: new FormControl(productData['UOM'] || '', Validators.compose([Validators.required])),
            UOM: new FormControl((productData['UOM'] === null || productData['UOM'] === 'null') ? '' : productData['UOM']),
            isQuote: new FormControl(productData['isQuote'] || false),
            MRP: new FormControl(productData['MRP'] || 0.00, Validators.compose([Validators.required])),
            sellPrice: new FormControl(productData['sellPrice'] || 0.00),
            walletPrice: new FormControl(productData['walletPrice'] || 0.00),
            noDiscount: new FormControl(productData['noDiscount'] || false),
            isSale: new FormControl(productData['isSale'] || false),
            shortDesciption: new FormControl(productData['shortDesciption'] || ''),
            description: new FormControl(productData['description'] || ''),
            video: new FormControl(productData['video'] || ''),
            features: new FormControl(productData['features'] || ''),
            warranty: new FormControl(productData['warranty'] || this.defaultWarranty),
            isPackage: new FormControl(productData['isPackage'] || false),
            metaTitle: new FormControl(productData['metaTitle'] || ''),
            metaDescription: new FormControl(productData['metaDescription'] || ''),
            metaKeyword: new FormControl(productData['metaKeyword'] || ''),
            isQuantityDiscount: new FormControl(productData['isQuantityDiscount'] || false),
            productVariants: new FormArray([]),
            quantityDiscounts: new FormControl(''),
            sellerProducts: this.formBuilder.array([this.setSellerData([])]),
            sellerId: new FormControl(localStorage.getItem('sellerId') ? Number(localStorage.getItem('sellerId')) : '')
        });
        this.isFormPrepared = true;

        const selectedValues = {};
        if (productData['countryId']) {
            await this.populateCountryBasedDropdowns(productData['countryId']);
            selectedValues['selectedCountry'] = this.setDropdownValue(this.dropdownBinding['countries'], productData['countryId']);
            this.newProductForm.patchValue({
                countryId: selectedValues['selectedCountry']
            });
            if (productData['supplyTypeId']) {
                this.newProductForm.patchValue({ supplyTypeId: this.setDropdownValue(this.dropdownBinding['supplyTypes'], productData['supplyTypeId']) });
            }
            if (productData['manufactureId']) {
                this.newProductForm.patchValue({ manufactureId: this.setDropdownValue(this.dropdownBinding['manufacturerBrands'], productData['manufactureId']) });
            }
            if (productData['languageId']) {
                selectedValues['selectedLanguage'] = this.setDropdownValue(this.dropdownBinding['languages'], productData['languageId']);
                this.newProductForm.patchValue({
                    languageId: selectedValues['selectedLanguage']
                });
                await this.populateLanguageBasedDropdowns(productData['languageId'], productData['countryId']);
                if (productData['categoryId']) {
                    this.newProductForm.patchValue({ categoryId: this.setDropdownValue(this.dropdownBinding['categories'], productData['categoryId']) });
                }
            }
            if (productData['countryOriginId']) {
                this.newProductForm.patchValue({ countryOriginId: this.setDropdownValue(this.dropdownBinding['countryOriginList'], productData['countryOriginId']) });
            }
            if (productData['speciality']) {
                this.newProductForm.patchValue({ speciality: this.setDropdownValue(this.specialityList, productData['speciality']) });
            }
        }
        if (productData['isQuote']) {
            this.conditions['disablePrice'] = true;
        }

        if (productData['catelogue']) {
            this.editCatalogImages.push(productData['catelogue']);
        }
        if (productData['productVariants'] && productData['productVariants'].length > 0) {
            this.conditions['displayTable'] = true;
            productData['productVariants'].forEach(productVariant => {
                console.log('productVariant = ', productVariant);
                this.prepareVariantForm(productVariant);
            });
        }
        console.log('productVariants = ', this.newProductForm.value);
    }

    prepareVariantForm(variantDetail = {}) {
        const newVariantForm = this.formBuilder.group({
            productName: new FormControl(variantDetail['productName'] || '', Validators.compose([Validators.required])),
            PNCDE: new FormControl(variantDetail['PNCDE'] || '', Validators.compose([Validators.required])),
            quantity: new FormControl(variantDetail['sellerProducts'] && variantDetail['sellerProducts'][0]['quantity'], Validators.compose([Validators.required])),
            packageContent: new FormControl(variantDetail['packageContent'] || ''),
            MRP: new FormControl(variantDetail['MRP'] || 0.00),
            walletPrice: new FormControl(variantDetail['sellerProducts'] && variantDetail['sellerProducts'][0]['price'] || 0.00),
            sellerFee: new FormControl(Number(localStorage.getItem('sellerFee'))),
            deliveryTime: new FormControl(variantDetail['deliveryTime'] || 0),
            isSale: new FormControl(variantDetail['isSale'] || false),
            isQuote: new FormControl(variantDetail['isQuote'] || false),
            sellPrice: new FormControl(variantDetail['sellPrice'] || 0.00),
            // sellerProducts: new FormControl(variantDetail['sellerProducts'] || ''),
            sellerProducts: this.formBuilder.array([this.setSellerData((variantDetail['sellerProducts'] && variantDetail['sellerProducts'][0]) ? variantDetail['sellerProducts'][0] : '')]),
        });
        if (variantDetail['id']) {
            newVariantForm.addControl('id', new FormControl(variantDetail['id'], Validators.compose([Validators.required])));
        }
        this.variantDetail.push(newVariantForm);
    }

    openPopup(content) {
        this.prepareVariantForm();
        this.newVariantForm = this.variantDetail.at(this.variantDetail.length - 1) as FormGroup;
        this.variantSubmitted = false;
        // this.newVariantForm.reset();
        this.errorMessage['PNCDE_errorMessage_variant'] = '';
        this.errorMessage['PNCDE_successMessage_variant'] = '';
        if (this.newVariantForm) {
            this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                console.log('closeResult 1 = ', this.closeResult);
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                console.log('closeResult 2 = ', this.closeResult);
                if (reason) {
                    this.variantDetail.removeAt(this.variantDetail.length - 1);
                }
            });

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
            return;
        }
        this.conditions['isValidatePNForVariant'] = true;
        this.errorMessage['PNCDE_errorMessage_variant'] = '';
        this.modalService.dismissAll();
        // this.variantDetail.push(this.newVariantForm);
        this.PNCodeObj['productVariant'].push(this.newVariantForm.value['PNCDE']);
        // this.newVariantFormInit();
    }

    removeVariants(variantDetail, variantIndex) {
        if (variantDetail && variantDetail.value.id && ((this.conditions['isEditPage'] && !this.conditions['isLivePage']) || this.conditions['isDuplicatePage'])) {
            this.productService.deleteProductVariant(variantDetail.value.id).toPromise().then(res => {
                if (res['success']) {
                    this.variantDetail.removeAt(variantIndex);
                }
            }).catch(err => { });
        } else {
            this.variantDetail.removeAt(variantIndex);
        }
    }

    /*
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
            MRP: new FormControl(0.00, Validators.compose([Validators.required])),
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
            sellerProducts: this.formBuilder.array([this.setSellerData([])]),
            sellerId: new FormControl(localStorage.getItem('sellerId') ? Number(localStorage.getItem('sellerId')) : '')
        });
        this.newVariantFormInit();
    }
    */
    async setProductDetail(controlValue) {
        /*
 
        let selectedValues = {};
        this.conditions['isValidatePN'] = false;
 
        selectedValues['selectedCountry'] = await this.setDropdownValue(this.dropdownBinding['countries'], controlValue['countryId']);
 
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
 
        if ((this.conditions['isEditPage'] || this.conditions['isLivePage']) && !this.conditions['isDuplicatePage']) {
            this.editProductImages = [...controlValue['productImage']];
        }
 
        let productVariant = controlValue['productVariants'];
        if (productVariant && productVariant.length > 0) {
            this.conditions['displayTable'] = true;
            productVariant.forEach(variant => {
                this.newVariantFormInit(variant);
                this.variantDetail.push(this.newVariantForm);
                this.newVariantFormInit();
            });
        }
 
        let sellerProduct = controlValue['sellerProducts'];
        if (sellerProduct && sellerProduct.length > 0) {
            this.sellerDetail.removeAt(0);
            sellerProduct.forEach(seller => {
                this.sellerDetail.push(this.setSellerData(seller));
            });
        }
 
        if (controlValue['isQuote']) {
            this.conditions['disablePrice'] = true;
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
            MRP: controlValue['MRP'],
            sellPrice: controlValue['sellPrice'],
            walletPrice: controlValue['walletPrice'],
            noDiscount: controlValue['noDiscount'],
            isSale: controlValue['isSale'],
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
            sellerId: localStorage.getItem('sellerId') ? Number(localStorage.getItem('sellerId')) : '',
        });
        */
    }

    setSellerData(controlValue?: any) {
        return this.formBuilder.group({
            id: new FormControl((controlValue['id'] && (this.conditions['isEditPage'] || this.conditions['isLivePage']) ? controlValue['id'] : '')),
            sellerId: new FormControl(Number(localStorage.getItem('sellerId')) || ''),
            sellerFee: new FormControl(Number(localStorage.getItem('sellerFee')) || 0),
            quantity: new FormControl(controlValue['quantity'] || 0),
            deliveryTime: new FormControl(controlValue['deliveryTime'] || 0)
        });
    }

    getProductByProductId(id, isLivePage) {
        if (isLivePage) {
            this.productService.getLiveProductById(id).toPromise().then((res) => {
                if (res && res['success'] && res['data']) {
                    // this.setProductDetail(res['data']);
                    this.prepareForm(res['data']);
                    this.productStatus = res['data']['approvedStatus'];
                    this.rejectionMsg = res['data']['rejectionMessage'];
                }
            }).catch(err => { });
        } else {
            this.productService.getProductById(id).toPromise().then((res) => {
                if (res && res['success'] && res['data']) {
                    // this.setProductDetail(res['data']);
                    this.prepareForm(res['data']);
                    this.productStatus = res['data']['approvedStatus'];
                    this.rejectionMsg = res['data']['rejectionMessage'];
                }
            }).catch(err => { });
        }
    }

    // Add/remove validation for price
    onSelectQuote(event) {
        if (event.target.checked) {
            this.conditions['disablePrice'] = true;
            this.f['MRP'].setValue(0);
            this.f['MRP'].clearValidators();
        } else {
            this.conditions['disablePrice'] = false;
            this.f['MRP'].setValue('');
            this.f['MRP'].setValidators([Validators.required]);
        }
        this.f['MRP'].updateValueAndValidity();
    }

    // newVariantFormInit(controlValue: any = {}) {
    //     this.newVariantForm = this.formBuilder.group({
    //         id: new FormControl(controlValue['id'] && (this.conditions['isEditPage'] || this.conditions['isLivePage']) ? controlValue['id'] : ''),
    //         productName: new FormControl(controlValue['productName'] || '', Validators.compose([Validators.required])),
    //         PNCDE: new FormControl(controlValue['PNCDE'] || '', Validators.compose([Validators.required])),
    //         quantity: new FormControl(controlValue['sellerProducts'] && controlValue['sellerProducts'][0]['quantity'], Validators.compose([Validators.required])),
    //         packageContent: new FormControl(controlValue['packageContent'] || ''),
    //         MRP: new FormControl(controlValue['MRP'] || 0),
    //         walletPrice: new FormControl(controlValue['sellerProducts'] && controlValue['sellerProducts'][0]['price'] || 0),
    //         sellerFee: new FormControl(Number(localStorage.getItem('sellerFee')) || 0),
    //         deliveryTime: new FormControl(controlValue['deliveryTime'] || 0),
    //         isSale: new FormControl(controlValue['isSale'] || false),
    //         isQuote: new FormControl(controlValue['isQuote'] || false),
    //         sellPrice: new FormControl(controlValue['sellPrice'] || 0),
    //         // sellerProducts: new FormControl(controlValue['sellerProducts'] || ''),
    //         sellerProducts: this.formBuilder.array([this.setSellerData((controlValue['sellerProducts'] && controlValue['sellerProducts'][0]) ? controlValue['sellerProducts'][0] : '')]),
    //     });
    // }

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

    PNCDE_Check() {
        if (this.f['countryId']['invalid']) {
            this.errorMessage['PNCDE_errorMessage'] = 'Select Country First';
        } else if (this.f['languageId']['invalid']) {
            this.errorMessage['PNCDE_errorMessage'] = 'Select Language First';
        } else if (this.f['PNCDE'].value != "" && this.f['countryId'].value != undefined && this.f['languageId'].value != undefined) {

            this.PNCodeObj['product'] = this.f['PNCDE'].value;

            this.errorMessage['PNCDE_errorMessage'] = '';
            const selectedLanguageId = this.newProductForm.value['languageId']['value'];

            if ((this.PNCodeObj['productVariant'] && this.PNCodeObj['productVariant'].includes(this.f['PNCDE'].value))) {
                this.errorMessage['PNCDE_errorMessage'] = 'Entered SKU/ PN CDE already exists';
            } else {
                if (this.conditions['isEditPage'] && !this.conditions['isLivePage'] || this.conditions['isDuplicatePage']) {
                    this.productService.onCheckPncode(this.selectedCountryId, selectedLanguageId, this.f['PNCDE'].value, this.editProductId).toPromise().then((res) => {
                        if (res && res['success']) {
                            this.errorMessage['PNCDE_errorMessage'] = '';
                            this.conditions['isValidatePN'] = true;
                            this.errorMessage['PNCDE_successMessage'] = 'Entered SKU/ PN CDE is valid';
                        }
                    }).catch(err => {
                        this.conditions['isValidatePN'] = false;
                        this.f['PNCDE'].setValue('');
                        this.errorMessage['PNCDE_errorMessage'] = 'Entered SKU/ PN CDE already exists';
                    });
                } else {
                    this.productService.onCheckPncode(this.selectedCountryId, selectedLanguageId, this.f['PNCDE'].value, null).toPromise().then((res) => {
                        if (res && res['success']) {
                            this.errorMessage['PNCDE_errorMessage'] = '';
                            this.conditions['isValidatePN'] = true;
                            this.errorMessage['PNCDE_successMessage'] = 'Entered SKU/ PN CDE is valid';
                        }
                    }).catch(err => {
                        this.conditions['isValidatePN'] = false;
                        this.f['PNCDE'].setValue('');
                        this.errorMessage['PNCDE_errorMessage'] = 'Entered SKU/ PN CDE already exists';
                    });
                }
            }
        }
    }

    Variant_PNCDE_Check() {
        if (this.f['countryId']['invalid']) {
            this.errorMessage['PNCDE_errorMessage_variant'] = 'Select Country First';
        } else if (this.f['languageId']['invalid']) {
            this.errorMessage['PNCDE_errorMessage_variant'] = 'Select Language First';
        } else if (this.variantForm['PNCDE'].value != "" && this.f['countryId'].value != undefined && this.f['languageId'].value != undefined) {
            if (this.variantDetail.value && this.variantDetail.value.length > 0) {
                this.variantDetail.value.forEach(varDetail => {

                    if (this.conditions['isEditPage'] && !this.conditions['isLivePage'] || this.conditions['isDuplicatePage']) {
                        this.PNCodeObj['productVariant'].push(varDetail['PNCDE']);
                    }

                    if (varDetail['PNCDE'] === this.variantForm['PNCDE'].value || this.variantForm['PNCDE'].value === this.PNCodeObj['product']) {
                        this.errorMessage['PNCDE_errorMessage_variant'] = 'Entered SKU/ PN CDE already exists';
                    } else {
                        this.errorMessage['PNCDE_errorMessage_variant'] = '';
                        const selectedLanguageId = this.newProductForm.value['languageId']['value'];
                        this.productService.onCheckPncode(this.selectedCountryId, selectedLanguageId, this.variantForm['PNCDE'].value, null).toPromise().then((res) => {
                            if (res && res['success']) {
                                this.conditions['isValidatePNForVariant'] = true;
                                this.errorMessage['PNCDE_errorMessage_variant'] = '';
                                this.errorMessage['PNCDE_successMessage_variant'] = 'Entered SKU/ PN CDE is valid';
                            }
                        }).catch(err => {
                            this.variantForm['PNCDE'].setValue('');
                            this.errorMessage['PNCDE_errorMessage_variant'] = 'Entered SKU/ PN CDE already exists';
                        });
                    }
                });
            } else {
                if (this.variantForm['PNCDE'].value === this.f['PNCDE'].value) {
                    this.errorMessage['PNCDE_errorMessage_variant'] = 'Entered SKU/ PN CDE already exists';
                } else {
                    this.errorMessage['PNCDE_errorMessage_variant'] = '';
                    const selectedLanguageId = this.newProductForm.value['languageId']['value'];

                    if (this.PNCodeObj['productVariant'] && this.PNCodeObj['productVariant'].includes(this.f['PNCDE'].value)) {
                        this.errorMessage['PNCDE_errorMessage_variant'] = 'Entered SKU/ PN CDE already exists';
                    } else {
                        this.productService.onCheckPncode(this.selectedCountryId, selectedLanguageId, this.variantForm['PNCDE'].value, null).toPromise().then((res) => {
                            if (res && res['success']) {
                                this.conditions['isValidatePNForVariant'] = true;
                                this.errorMessage['PNCDE_errorMessage_variant'] = '';
                                this.errorMessage['PNCDE_successMessage_variant'] = 'Entered SKU/ PN CDE is valid';
                            }
                        }).catch(err => {
                            this.variantForm['PNCDE'].setValue('');
                            this.errorMessage['PNCDE_errorMessage_variant'] = 'Entered SKU/ PN CDE already exists';
                        });
                    }
                }
            }
        }
    }

    PNCodeChange(event) {
        this.errorMessage['PNCDE_errorMessage'] = '';
        this.errorMessage['PNCDE_errorMessage_variant'] = '';
        this.errorMessage['PNCDE_successMessage'] = '';
        this.conditions['isValidatePNForVariant'] = false;
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

                    if (controlType === 'catalog' && mimeType) {
                        if (mimeType === 'application/pdf') {
                            let reader = new FileReader();
                            reader.onload = (subEvent: any) => {
                                this.catalogImages.push({ image: subEvent.target.result, imgName: newFiles[i].name });
                            }
                            reader.readAsDataURL(newFiles[i]);
                        } else {
                            this.errorMessage['catalogError'] = 'Please select PDF file';
                            resetEvent.value = "";
                        }
                    }

                    if (controlType === 'PImages' && mimeType) {
                        if (mimeType === 'image/png' || mimeType === 'image/jpeg') {
                            const reader = new FileReader();
                            reader.onload = (subEvent: any) => {
                                this.productImages.push({ image: subEvent.target.result, imgName: newFiles[i].name });
                                this.errorMessage['imageError'] = '';
                            }
                            reader.readAsDataURL(newFiles[i]);
                        } else {
                            this.errorMessage['imageError'] = 'Please select png or jpeg images';
                        }
                    }
                }
            }
        }
    }

    PNCDE_Edit() {
        this.conditions['isEditPNCDE'] = true;
    }

    deleteProductImage(index, imageUploadType, imgData) {
        if (imageUploadType === 'new') {
            this.productImages.splice(index, 1);
        } else if (imageUploadType === 'uploaded') {
            const imgObj = {
                fileURL: imgData['image'],
                id: imgData['id']
            };
            this.productService.deleteProductImage(imgObj).toPromise().then(res => {
                if (res) {
                    this.editProductImages.splice(index, 1);
                }
            }).catch(err => { });

        } else if (imageUploadType === 'imgCatalog') {
            this.catalogImages.splice(index, 1);
        }
        else if (imageUploadType === 'uploadedCatalog') {
            const catalogObj = {
                fileURL: imgData,
                id: 0,
                productId: this.editProductId
            };

            this.productService.deleteProductImage(catalogObj).toPromise().then(res => {
                if (res) {
                    this.editCatalogImages.splice(index, 1);
                }
            }).catch(err => { });
        }
    }

    async onSubmit(productFormValid) {
        this.submitted = true;

        if (!productFormValid) {
            return;
        }

        if ((this.productImages && this.productImages.length === 0) && (this.editProductImages && this.editProductImages.length === 0)) {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'Please upload product image!' });
            this.errorMessage['imageError'] = "Please upload product image";
            return;
        }

        if (!this.conditions['isValidatePN'] && !this.conditions['isLivePage'] && !this.conditions['isEditPage']) {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'Please Validate PN CDE!' });
            return;
        }

        let formValues = JSON.parse(JSON.stringify(this.newProductForm.value));

        formValues['countryId'] = formValues['countryId']['value'];
        formValues['languageId'] = formValues['languageId']['value'];
        formValues['supplyTypeId'] = formValues['supplyTypeId']['value'];
        formValues['categoryId'] = formValues['categoryId']['value'];
        formValues['manufactureId'] = formValues['manufactureId']['value'];
        formValues['speciality'] = (formValues['speciality'] && formValues['speciality']['label']) ? formValues['speciality']['label'] : '';
        formValues['countryOriginId'] = (formValues['countryOriginId'] && formValues['countryOriginId']['value']) ? formValues['countryOriginId']['value'] : '';
        formValues['code'] = formValues['PNCDE'];
        formValues['sellerProducts'][0] = await this.productService.addDefaultKeyForSeller(formValues['sellerProducts'][0],
            formValues['productName'], formValues['countryId'], formValues['languageId']);

        if (formValues['productVariants'] && formValues['productVariants'].length > 0) {

            formValues['productVariants'].forEach((varDetail) => {
                const finalArrObj = [];
                const sellerObj = {
                    sellerId: Number(localStorage.getItem('sellerId')),
                    sellerFee: Number(localStorage.getItem('sellerFee')),
                    quantity: varDetail['quantity'] || '',
                    deliveryTime: varDetail['deliveryTime'] || '',
                    productName: varDetail['productName'] || ''
                };
                // if (varDetail['id']) {
                //   sellerObj['id'] = varDetail['id'];
                // }
                finalArrObj.push(sellerObj);
                varDetail.sellerProducts = finalArrObj;
            });

            const res = [];
        //    const res = this.productService.addOtherKeysToVarientEdit(
            //     formValues['productVariants'],
            //     formValues['countryId'],
            //     formValues['languageId'],
            //     formValues['manufactureId'],
            //     formValues['supplyTypeId'],
            //     formValues['categoryId'],
            //     formValues['speciality'],
            //     formValues['sellerId'],
            //     formValues['sellerProducts']
            // );
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

        if (formValues['sellerProducts'][0]['id'] === null) {
            delete formValues['sellerProducts'][0]['id'];
        }
        formValues['sellerProducts'] = JSON.stringify(formValues['sellerProducts']);

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
                        await delete formValues[formKey];
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

        this.showConfirm();
        this.finalData = formData;
    }

    showConfirm() {
        this.messageService.clear();
        this.messageService.add({ key: 'c', sticky: true, summary: 'Are you sure?', detail: 'Confirm to proceed' });
    }

    onConfirm() {
        this.messageService.clear('c');
        this.productService.addProduct(this.finalData, this.conditions['isLivePage']).toPromise().then((res) => {
            if (res && res['success']) {
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
        }).catch(err => { })

    }

    onReject() {
        this.messageService.clear('c');
    }

    addDefaultKeyForSeller(editObj, productName, countryId, languageId) {
        editObj['countryId'] = countryId;
        editObj['productName'] = productName;
        editObj['languageId'] = languageId;
        return editObj;
    }

    setDropdownValue(arr, id = '') {
        let newOBJ = {};
        if (arr && arr.length > 0) {
            newOBJ = arr.find(element => (element['value'] === id || element['label'] === id));
        }
        return newOBJ;
    }

    dataURLtoFile(dataurl, filename) {
        const arr = dataurl.split(',');
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
        var isDefault = true;
        let defaultData = { id, productId, isDefault }

        this.productService.defaultImage(defaultData).toPromise().then(res => {
            if (res && res['success']) {
                this.editProductImages.forEach((element, index) => {
                    if (index == imageIndex) {
                        element.isDefault = true;
                    }
                    else {
                        element.isDefault = false;
                    }
                });
            }
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

}
