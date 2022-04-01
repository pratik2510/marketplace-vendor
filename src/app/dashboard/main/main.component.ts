import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ShareModuleService } from '../../share/service/share-module.service';
import { DashboardService } from '../service/dashboard.service';
import { ProductService } from '../../product/service/product.service';
import { productQuantityColumnData, productPriceColumnData } from '../service/dashboardModule-tableData';
import { Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'ngx-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

  filterForm: FormGroup;
  rangeDates: Date[];
  currentDate;
  sidebarBoxValue = {};
  overViewSection = [];
  productQuantityColumnData = productQuantityColumnData;
  productPriceColumnData = productPriceColumnData;
  dropdownBinding = {};
  barChartLabels: Label[] = [];
  barChartData: ChartDataSets[] = [];
  chartOption = {
    mainTitle: 'Total Earnings',
    axesLabel: {
      x: "Total Sales (MM-YYYY)",
      y: "Earning"
    }
  };
  tableData = {};

  constructor(
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private shareService: ShareModuleService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.currentDate = new Date();
    this.initFormGroup();
    this.getTimePeriod(30, null);
    this.getFilterData();
    this.populateFilterDropdown();
  }

  initFormGroup() {
    this.filterForm = this.formBuilder.group({
      selectedDate: new FormControl(this.rangeDates),
      Product: new FormControl(null),
      Brand: new FormControl(null),
      mainCategory: new FormControl(null),
      subCategory: new FormControl(null)
    });
  }

  // ngOnDestroy(): void {
  //   this.themeSubscription.unsubscribe();
  // }

  get f() { return this.filterForm.controls; }

  getFilterData() {

    this.tableData['quantityTable'] = [];
    this.tableData['topProductAmount'] = [];
    this.barChartData = [];
    this.overViewSection = [];

    this.dashboardService.getAllChartData(this.f['selectedDate'].value).toPromise().then(res => {

      if (res && res['data'] && res['data']['totalEarnings']) {
        const totalSalesObj = res['data']['totalEarnings'];
        this.barChartLabels = totalSalesObj['label'];

        this.sidebarBoxValue['todayOrders'] = res['data']['todayOrders'];
        this.sidebarBoxValue['totalProducts'] = res['data']['totalProducts'];
        this.sidebarBoxValue['totalOrder'] = res['data']['totalOrders'];
        this.sidebarBoxValue['totalNetSales'] = res['data']['totalNetSales'];
        this.sidebarBoxValue['totalOutOfStock'] = res['data']['totalOutOfStock'];

        if (totalSalesObj['data'] && totalSalesObj['data'].length > 0) {
          this.barChartData.push(
            { data: totalSalesObj['data'], backgroundColor: '#bee3f8', hoverBackgroundColor: '#85cef7', spanGaps: false });
          this.tableData['quantityTable'] = [...res['data']['top_selling_products_by_qty']];
          this.tableData['topProductAmount'] = [...res['data']['top_selling_products_by_amount']];
        } else {
          this.barChartData = [];
        }

        const dateArr = this.f['selectedDate'].value;
        const queryParams = {};
        const todayDate = moment(new Date()).format('YYYY-MM-DD');

        queryParams['start_date'] = (dateArr[0]) ? moment(dateArr[0]).format('YYYY-MM-DD') : todayDate;
        queryParams['end_date'] = (dateArr[1]) ? moment(dateArr[1]).format('YYYY-MM-DD') : moment(dateArr[0]).format('YYYY-MM-DD');

        this.overViewSection.push(
          {
            title: `Net Sales ( ${localStorage.getItem('symbol')})`,
            Value: this.sidebarBoxValue['totalNetSales'] || 0,
            isViewMore: false,
            textColor : 'text-success'
          },
          {
            title: "Today's Orders",
            Value: this.sidebarBoxValue['todayOrders'] || 0,
            link: "/order/filter",
            queryParam: { 'startdate': todayDate, 'enddate': todayDate, 'detail' : 'todaysorders'},
            isViewMore: true,
            textColor : 'text-primary',
            bgColor : '#3366ff'
          },
          {
            title: 'Total Products',
            Value: this.sidebarBoxValue['totalProducts'] || 0,
            link: '/product/filter',
            queryParam: { 'startdate': '', 'enddate': ''  ,'detail' : 'totalproducts'},
            isViewMore: true,
            textColor : 'text-warning',
            bgColor : '#ffaa00'
          },
          {
            title: "Total Orders",
            Value: this.sidebarBoxValue['totalOrder'] || 0,
            link: '/order/filter',
            queryParam: { 'startdate': queryParams['start_date'], 'enddate': queryParams['end_date'],'detail' : 'totalorders'},
            isViewMore: true,
            textColor : 'text-info',
            bgColor : '#17a2b8 '        
          },
          {
            title: 'Total out of stock',
            Value: this.sidebarBoxValue['totalOutOfStock'] || 0,
            link: '/product/filter',
            queryParam: { 'startdate': '', 'enddate': '', 'outofstock': 'true' ,'detail' : 'totaloutofstock' },
            isViewMore: true,
            textColor : 'text-danger',
            bgColor : '#ff3d71'       
          }
        );

      } else {
        this.barChartData = [];
        this.setDefaultOverViewSection();
      }
    }).catch(err => {
      this.barChartData = [];
      this.setDefaultOverViewSection();
    });
  }

  getTimePeriod(noOfDays, noOfMonths) {
    const startingDate = this.shareService.getPreviousMonths(noOfDays, noOfMonths);
    this.f['selectedDate'].patchValue([new Date(startingDate), new Date()]);
  }

  sinceInception() {
    const startingDate = moment('01-01-1970').format('YYYY-MM-DD');
    this.f['selectedDate'].patchValue([new Date(startingDate), new Date()]);
    this.OnDateSelection();
  }

  OnDateSelection() {
    this.getFilterData();
  }

  clearDate() {
    this.f['selectedDate'].patchValue(this.rangeDates);
    this.getTimePeriod(30, null);
    this.getFilterData();
  }

  populateFilterDropdown() {
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
      // console.log("event['value']['value']...........", event['value']['value']);
    }
  }

  setDefaultOverViewSection() {
    this.overViewSection = [];
    const dateArr = this.f['selectedDate'].value;
    const queryParams = {};
    const todayDate = moment(new Date()).format('YYYY-MM-DD');

    queryParams['start_date'] = (dateArr[0]) ? moment(dateArr[0]).format('YYYY-MM-DD') : todayDate;
    queryParams['end_date'] = (dateArr[1]) ? moment(dateArr[1]).format('YYYY-MM-DD') : moment(dateArr[0]).format('YYYY-MM-DD');

    this.overViewSection.push(
      {
        title: `Net Sales ( ${localStorage.getItem('symbol')})`,
        Value: 0,
        isViewMore: false,
        textColor : 'text-success',
        bgColor : '#fff'
      },
      {
        title: "Today's Orders",
        Value: 0,
        link: "/order/filter",
        queryParam: { 'startdate': todayDate, 'enddate': todayDate },
        isViewMore: true,
        textColor : 'text-primary',
        bgColor : '#3366ff'
      },
      {
        title: 'Total Products',
        Value: 0,
        link: '/product/filter',
        queryParam: { 'startdate': '', 'enddate': '' },
        isViewMore: true,
        textColor : 'text-warning',
        bgColor : '#ffaa00'
      },
      {
        title: "Total Orders",
        Value: 0,
        link: '/order/filter',
        queryParam: { 'startdate': queryParams['start_date'], 'enddate': queryParams['end_date'] },
        isViewMore: true,
        textColor : 'text-info',
        bgColor : '#17a2b8 '  
      },
      {
        title: 'Total out of stock',
        Value: 0,
        isViewMore: false,
        textColor : 'text-danger',
        bgColor : '#ff3d71'      
      }
    );

  }

}
