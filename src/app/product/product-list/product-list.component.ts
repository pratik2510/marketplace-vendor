
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { ProductService } from '../service/product.service';
import { ExcelServiceService } from '../service/excel-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProductChildColumnData, productActions, ProductColumnData,
  LiveProductColumnData, LiveChildColumnData, liveProductActions
} from '../service/productModule-tableData';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ConfirmationService],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class ProductListComponent implements OnInit {

  products: any[];
  liveProducts: any[];
  countries: any[];
  categories: any[];
  filterForm: FormGroup;
  isLiveProduct = false;
  totalProduct;
  @ViewChild('paginator', { static: false }) paginator: Paginator;
  exportData: any[];
  exportAllData: any[];
  setDefaultPageNo = 0;
  queryParamObj = {};
  tableTitle = 'PRODUCT_LIST.TITTLE.PRODUCTS';
  isLoading = false;
  ProductColumnData = ProductColumnData;
  LiveProductColumnData = LiveProductColumnData;
  ProductChildColumnData = ProductChildColumnData;
  LiveChildColumnData = LiveChildColumnData;
  productActions = productActions;
  liveProductActions = liveProductActions;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private excelService: ExcelServiceService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    router.events.subscribe((val) => {
      if (this.activatedRoute.snapshot.queryParams['startdate']) {
        this.queryParamObj['startDate'] = this.activatedRoute.snapshot.queryParams['startdate'];
        this.queryParamObj['endDate'] = this.activatedRoute.snapshot.queryParams['enddate'];
        this.queryParamObj['outofstock'] = this.activatedRoute.snapshot.queryParams['outofstock'];
        this.queryParamObj['detail'] = this.activatedRoute.snapshot.queryParams['detail'];
        if (this.queryParamObj['detail']) {
          const pageType = this.queryParamObj['detail'];
          if (pageType == 'todaysorders') {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.TODAYORDER';
          } else if (pageType == 'totalproducts') {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.PRODUCTS';
          }
          else if (pageType == 'totalorders') {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.TOTALORDER';
          }
          else if (pageType == 'totaloutofstock') {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.OUTOFSTOCK';
          } else {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.PRODUCTS';
          }
        }
      }
      if (this.activatedRoute.snapshot.queryParams['outofstock']) {
        this.queryParamObj['outofstock'] = 'true';
        this.isLiveProduct = true;
        this.tableTitle = 'PRODUCT_LIST.TITTLE.OUTOFSTOCK';
      }
    });
  }

  ngOnInit(): void {
    if (this.router.url.includes('/product/live')) {
      this.isLiveProduct = true;
      this.tableTitle = 'PRODUCT_LIST.TITTLE.LIVE_PRODUCTS';
    }

    this.exportData = [];
    this.exportAllData = [];
    this.filterFormGroup();
    this.getCountry();
    this.getCategoryList();
    this.conditionBaseGetProduct();

    // Sidebar Options
    this.translate.stream([
      'DROPDOWN_OPTION.DUPLICATE',
      'DROPDOWN_OPTION.EDIT',
      'DROPDOWN_OPTION.DOWNLOAD_PO',
      'DROPDOWN_OPTION.DELETE',
      'DROPDOWN_OPTION.CURRENT_DATA'
    ]).subscribe(res => {
      this.productActions['settingOptions'] = [
        { title: res['DROPDOWN_OPTION.DUPLICATE'] },
        { title: res['DROPDOWN_OPTION.EDIT'] }
      ];
      this.productActions['settingOptions_variant'] = [
        { title: res['DROPDOWN_OPTION.DELETE'] }
      ];
      this.liveProductActions['settingOptions'] = [
        { title: res['DROPDOWN_OPTION.EDIT'] }
      ];
      this.exportAllData = [
        {
          label: res['DROPDOWN_OPTION.CURRENT_DATA'], command: () => { this.exportDataAsExcel(0); }
        }
      ];
    });
  }

  filterFormGroup() {
    this.filterForm = this.formBuilder.group({
      countryId: new FormControl(null),
      categoryId: new FormControl(null),
      searchKey: new FormControl(''),
      exportAll: new FormControl(false),
      currentPage: new FormControl(0),
      shorting: new FormControl(null),
      startDate: new FormControl(this.queryParamObj['startDate'] || null),
      endDate: new FormControl(this.queryParamObj['endDate'] || null),
      outofstock: new FormControl(this.queryParamObj['outofstock'] || ''),
      tableTitle: new FormControl(this.queryParamObj['tableTitle'] || ''),
    });
  }

  get f() { return this.filterForm.controls; }

  getProductList(reqObj) {
    this.productService.getAllProduct(reqObj).toPromise().then((res) => {
      if (res && res['success'] && res['data']['results'].length > 0) {
        this.products = res['data']['results'];
        this.totalProduct = res['data']['total'];
      } else {
        this.products = [];
        this.totalProduct = 0;
      }
    }).catch(err => { });
  }

  getLiveProductList() {
    this.productService.getLiveProduct(this.filterForm.value).toPromise().then((res) => {
      if (res && res['success'] && res['data']['results'].length > 0) {
        this.products = res['data']['results'];
        this.totalProduct = res['data']['total'];
      } else {
        this.products = [];
        this.totalProduct = 0;
      }
    }).catch(err => { });
  }

  getCountry() {
    this.productService.getCountry().toPromise().then((res) => {
      if (res && res['success'] && res['data'].length > 0) {
        this.countries = this.productService.arrayOfStringsToArrayOfObjects(res.data);
      } else {
        this.countries = [];
      }
    }).catch(err => { });
  }

  OnCountryChange(event) {
    if (event.value && event['value']['value']) {
      this.filterForm.patchValue({
        currentPage: 0
      });
      this.setDefaultPageNo = 0;
    }
    this.conditionBaseGetProduct();
  }

  getCategoryList() {
    this.productService.getCategory(null, null, true).toPromise().then((res) => {
      this.categories = this.productService.arrayOfStringsToArrayOfObjects(res['data']);
    }).catch(err => { this.categories = []; })
  }

  OnCategoryChange(event) {
    if (event.value && event['value']['value']) {
      this.filterForm.patchValue({
        currentPage: 0
      });
      this.setDefaultPageNo = 0;
    }
    this.conditionBaseGetProduct();
  }

  OnSearchChange(event) {
    if (event && event.target.value) {
      this.filterForm.patchValue({
        currentPage: 0
      });
      this.setDefaultPageNo = 0;
    }
    this.conditionBaseGetProduct();
  }

  conditionBaseGetProduct() {
    if (!this.isLiveProduct) {
      this.getProductList(this.filterForm.value);
    } else {
      this.getLiveProductList();
    }
  }

  paginate(event) {
    if (event && event.page) {
      this.filterForm.patchValue({
        currentPage: event.page
      });
    } else {
      this.filterForm.patchValue({
        currentPage: 0
      });
      this.setDefaultPageNo = 0;
    }
    this.conditionBaseGetProduct();
  }

  setDefaultPage(event) {
    this.setDefaultPageNo = event.first;
  }

  fetchAction(event) {
    if (event && event.includes('ChildMenu_Delete')) {
      const eventArr = event.split('||');
      const variantId = eventArr[1];
      this.deleteVariant(variantId);
    }
  }

  deleteVariant(variantId) {
    this.productService.deleteProductVariant(variantId).toPromise().then((response) => {
      if (response && response['success']) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Variant deleted successfully!' });
        this.conditionBaseGetProduct();
      }
    }).catch(error => { });
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAsExcelFile(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }

  exportDataAsExcel(id: number) {
    if (id == 0) {
      this.products.forEach((element, index) => {
        let adminStatus = '';

        if (element.adminStatus == '1') {
          adminStatus = "Active";
        } else {
          adminStatus = "Inactive";
        }

        this.exportData.push({
          Tag: "product",
          S_No: index,
          ProductCode: element.PNCDE,
          ProductId: element.id,
          Product_Name: element.productName,
          price: element.MRP,
          Brand_name: element.manufactureDetail.manufacturerName,
          Seller: element.sellerDetail.sellerName,
          Is_Variant: element.isPackage,
          Admin_Status: adminStatus
        })

        if (element.productVariants) {
          let variantlist = element.productVariants;
          for (var j = 0; j < variantlist.length; j++) {
            if (element.id == variantlist[j].productId) {
              this.exportData.push({
                Tag: "variant",
                // ProductID:variantlist[j].productId,
                varainID: variantlist[j].id,
                varaintName: variantlist[j].variant,
                Stock: variantlist[j].quantity,
                variant_price: variantlist[j].MRP,
                Variant_Refrence: variantlist[j].isQuote
              })
            }
          }
        }
      })
      this.excelService.exportAsExcelFile(this.exportData, 'Product List')
      this.exportData = [];
    }
  }

  applyShorting(event) {
    if (event && event.includes('appliedShorting')) {
      const eventArr = event.split('||');
      const shortingObj = JSON.parse(eventArr[1]);
      this.filterForm.patchValue({
        shorting: shortingObj
      });
      this.conditionBaseGetProduct();
    }
  }

  exportMyProduct() {
    this.isLoading = true;
    this.confirmationService.confirm({
      message: 'Are you sure you want to sync Live Products into My Products?',
      accept: () => {
        this.productService.exportMyProduct().toPromise().then(response => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Seller products export successfully.' });
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
    });
    this.isLoading = false;
  }




}
