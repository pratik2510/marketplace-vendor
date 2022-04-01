import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Paginator } from 'primeng/paginator';
import { OrderService } from '../service/order.service';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import { NbDateService } from '@nebular/theme';
import { ExcelServiceService } from '../../product/service/excel-service.service';
import { ShareModuleService } from '../../share/service/share-module.service';
import { orderActions, orderColumnData } from '../service/orderModule-tableData';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'ngx-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [DatePipe]
})

export class OrderListComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: Paginator;
  filterForm: FormGroup;
  orderList = [];
  setDefaultPageNo = 0;
  totalProduct;
  rangeDates: Date[];
  selectedOrderId = null;
  searchTxt = null;
  exportData = [];
  currencySymbol;
  orderColumnData = orderColumnData;
  orderActions = orderActions;
  currentDate = new Date();
  filterDate = {};
  tableTitle = 'PRODUCT_LIST.TITTLE.TOTALORDER';

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    public datePipe: DatePipe,
    protected dateService: NbDateService<Date>,
    private excelService: ExcelServiceService,
    private shareService: ShareModuleService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {

    router.events.subscribe((val) => {
      if (this.activatedRoute.snapshot.queryParams['startdate']) {
        this.filterDate['startdate'] = this.activatedRoute.snapshot.queryParams['startdate'];
        this.filterDate['enddate'] = this.activatedRoute.snapshot.queryParams['enddate'];
      }
      if (this.activatedRoute.snapshot.queryParams['startdate']) {
        this.filterDate['startDate'] = this.activatedRoute.snapshot.queryParams['startdate'];
        this.filterDate['endDate'] = this.activatedRoute.snapshot.queryParams['enddate'];
        this.filterDate['detail'] = this.activatedRoute.snapshot.queryParams['detail'];

        if (this.filterDate['detail']) {
          const pageType = this.filterDate['detail'];
          if (pageType === 'todaysorders') {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.TODAYORDER';
          } else if (pageType === 'totalproducts') {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.TOTALPRODUCT';
          }
          else if (pageType === 'totalorders') {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.TOTALORDER';
          }
          else if (pageType === 'totaloutofstock') {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.OUTOFSTOCK';
          } else {
            this.tableTitle = 'PRODUCT_LIST.TITTLE.PRODUCTS';
          }
        }
      }

      if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['detail']) {
        const pageType = this.activatedRoute.snapshot.queryParams['detail'];
        this.filterDate['detail'] = pageType;
        if (pageType === 'totaloutofstock') {
          this.tableTitle = 'PRODUCT_LIST.TITTLE.OUTOFSTOCK';
        }
      }
    });
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.currencySymbol = localStorage.getItem('symbol');
    this.getOrderList(this.filterForm.value);
    this.translate.stream([
      'DROPDOWN_OPTION.DOWNLOAD_PO'
    ]).subscribe(res => {
      this.orderActions['settingOptions'] = [
        { title: res['DROPDOWN_OPTION.DOWNLOAD_PO'] }
      ];
    });
  }

  initFormGroup() {
    this.filterForm = this.formBuilder.group({
      searchKey: new FormControl(''),
      selectedDate: new FormControl(this.filterDate['startdate'] ?
        [this.filterDate['startdate'], this.filterDate['enddate']] : this.rangeDates),
      currentPage: new FormControl(0),
      shorting: new FormControl(null)
    });
  }

  OnSearchChange(event) {
    if (event && event.target.value) {
      this.filterForm.patchValue({ currentPage: 0 , searchKey: (event.target.value) ? event.target.value.trim() : null });
      this.setDefaultPageNo = 0;
    }else{
    this.filterForm.patchValue({ currentPage: 0 , searchKey: null });
    this.setDefaultPageNo = 0;
    }
    this.getOrderList(this.filterForm.value);
  }


  get f() { return this.filterForm.controls; }

  getOrderList(formValue) {

    if (this.filterDate['startdate']) {
      this.f['selectedDate'].patchValue([new Date(this.filterDate['startdate']), new Date(this.filterDate['enddate'])]);
    }

    this.orderService.getAllOrder(formValue).toPromise().then((res) => {
      if (res && res['success'] && res['data']['results'].length > 0) {
        res['data']['results'].forEach((oderDetail) => {
          if (oderDetail) {
            let noArr = oderDetail['orderNo'].split("/");
            let poNumber = 'PO/' + noArr[1];
            oderDetail['orderNo'] = poNumber;
            let total = 0;
            if (oderDetail['orderProducts'] && oderDetail['orderProducts'].length > 0) {
              oderDetail['orderProducts'].forEach(orderProduct => {
                if (orderProduct['total']) {
                  total = Number(total) + Number(orderProduct['total']);
                }
              });
            }
            oderDetail['finalTotal'] = total;
          }
        });
        this.orderList = res['data']['results'];
        this.totalProduct = res['data']['total'];
      } else {
        this.orderList = [];
        this.totalProduct = 0;
      }
    }).catch(err => { });
  }

  paginate(event) {
    if (event && event.page) {
      this.filterForm.patchValue({ currentPage: event.page });
    } else {
      this.setFirstPage();
    }
    this.getOrderList(this.filterForm.value);
  }

  setDefaultPage(event) {
    this.setDefaultPageNo = event.first;
  }

  loadDataLazy(event: LazyLoadEvent) {
    if (event && event.first) {
      this.filterForm.patchValue({ currentPage: (event.first / 10) });
    }
    this.getOrderList(this.filterForm.value);
  }

  search() {
    this.setFirstPage();
    this.filterForm.patchValue({ currentPage: 0 });
    this.getOrderList(this.filterForm.value);
  }

  clearDate() {
    this.setFirstPage();
    this.filterForm.patchValue({ currentPage: 0 , selectedDate: null });
    this.getOrderList(this.filterForm.value);
  }

  getTimePeriod(noOfDays, noOfMonths) {
    const startingDate = this.shareService.getPreviousMonths(noOfDays, noOfMonths);
    this.f['selectedDate'].patchValue([new Date(startingDate), new Date()]);
  }

  OnDateSelection() {
    this.setFirstPage();
    this.filterForm.patchValue({ currentPage: 0 });
    this.getOrderList(this.filterForm.value);
  }

  setFirstPage() {
    this.filterForm.patchValue({ currentPage: 0 });
    this.setDefaultPageNo = 0;
  }

  getSearchValue(event) {
    this.searchTxt = event.target.value;
  }

  exportDataAsExcel() {
    this.orderList.forEach((element, index) => {
      this.exportData.push({
        S_No: index,
        Purchase_Order_No: element.orderNo,
        Date: moment(element.orderDate).format('YYYY-MM-DD'),
        Order_Total: element.finalTotal
      });
    })
    this.excelService.exportAsExcelFile(this.exportData, 'Order List')
    this.exportData = [];
  }

  applyShorting(event) {
    if (event && event.includes('appliedShorting')) {
      const eventArr = event.split('||');
      const shortingObj = JSON.parse(eventArr[1]);
      this.filterForm.patchValue({
        shorting: shortingObj
      });
      this.getOrderList(this.filterForm.value);
    }
  }

}