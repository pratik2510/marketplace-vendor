import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  getCountry(): any {
    return this.http.get('/admin/country');
  }

  getSupplyTypeList(countryId) {
    const queryParams = { countryId: countryId }
    return this.http.get('/admin/supplyTypeList', { params: queryParams });
  }

  getManufacturerList(countryId) {
    const queryParams = { countryId: countryId }
    return this.http.get('/admin/manufacturerList/', { params: queryParams });
  }

  getCountryLanguage(countryId) {
    return this.http.get('/admin/getCountryLanguage/' + countryId);
  }

  getCountryCurrency(country) {
    return this.http.get('/admin/getCountryCurrency/' + country);
  }

  getCategory(languageId, countryId, isDisplayProductPage) {
    if (isDisplayProductPage) {
      return this.http.get('/admin/categoryList');
    } else {
      const params = { languageId: languageId, countryId: countryId }
      return this.http.get('/admin/categoryList', { params: params });
    }
  }

  getSpeciality() {
    return this.http.get('/customer/speciality');
  }

  getCountryOrigin() {
    return this.http.get('/admin/getCountryOrigin');
  }

  onCheckPncode(countryId, languageId, PNCDE, productId) {
    let params = {};
    if (productId) {
      params = { countryId: countryId, languageId: languageId, PNCDE: PNCDE, productId: productId };
    } else {
      params = { countryId: countryId, languageId: languageId, PNCDE: PNCDE };
    }
    return this.http.get('/seller/checkPncode', { params: params });
  }

  onCheckPnCode(params = {}) {
    return this.http.get('/seller/checkPncode', { params: params });
  }

  addProduct(reqPayload, isLivePage) {
    if (isLivePage) {
      return this.http.post('/seller/liveProduct/v2', reqPayload);
      // return this.http.post('/seller/liveProduct', reqPayload);
    } else {
      // return this.http.post('/seller/product', reqPayload);
      return this.http.post('/seller/product/v2', reqPayload);
    }
  }

  getAllProduct(reqObj) {
    if (reqObj) {
      const params = {
        page: reqObj['currentPage'],
        searchKey: reqObj['searchKey'],
        exportAll: reqObj['exportAll'],
        countryId: (reqObj['countryId'] && reqObj['countryId']['value']) ? reqObj['countryId']['value'] : 'null',
        categoryId: (reqObj['categoryId'] && reqObj['categoryId']['value']) ? reqObj['categoryId']['value'] : 'null',
        sellerId: Number(localStorage.getItem('sellerId')),
        start_date: (reqObj['startDate']) ? reqObj['startDate'] : '',
        end_date: (reqObj['endDate']) ? reqObj['endDate'] : '',
        outofstock: (reqObj['outofstock']) ? reqObj['outofstock'] : '',
        tableTitle: (reqObj['tableTitle']) ? reqObj['tableTitle'] : '',
      };
      return this.http.get('/seller/product', { params: params });
    }
  }

  getLiveProduct(reqObj) {
    if (reqObj) {
      const params = {
        page: reqObj['currentPage'],
        searchKey: reqObj['searchKey'],
        countryId: (reqObj['countryId'] && reqObj['countryId']['value']) ? reqObj['countryId']['value'] : 'null',
        categoryId: (reqObj['categoryId'] && reqObj['categoryId']['value']) ? reqObj['categoryId']['value'] : 'null',
        sellerId: Number(localStorage.getItem('sellerId')),
        start_date: (reqObj['startDate']) ? reqObj['startDate'] : '',
        end_date: (reqObj['endDate']) ? reqObj['endDate'] : '',
        outofstock: (reqObj['outofstock']) ? reqObj['outofstock'] : '',
      };
      return this.http.get('/seller/liveProduct', { params: params });
    }
  }

  arrayOfStringsToArrayOfObjects(arr: any[]) {
    const newArray = [];
    if (arr && arr.length > 0) {
      return Array.from(arr, ({ itemName, id }) => {
        return {
          label: itemName,
          value: id
        };
      });
    }
    return newArray;
  }


  addOtherKeysToVarientEdit1(arr: any[]) {
    if (arr && arr.length > 0) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element['sellPrice'] != 0) {
          const discount = Math.round((+element['sellPrice'] - +element.MRP) / +element['sellPrice'] * 100);
          element['discount'] = (discount > 0) ? discount : 0;
        } else {
          element['discount'] = 0;
        }
      }
    }
    return arr;
  }

  deleteProduct(id) {
    return this.http.delete('/seller/product/' + id);
  }

  deleteProductVariant(id) {
    return this.http.delete('/seller/productVariant/' + id);
  }

  getProductById(pid) {
    return this.http.get('/seller/product/' + pid);
  }

  getLiveProductById(pid) {
    return this.http.get('/seller/liveProduct/' + pid);
  }

  deleteProductImage(reqPayload) {
    return this.http.post('/seller/removeProductImage', reqPayload);
  }

  defaultImage(data: { id: Number; productId: Number; isDefault: boolean }) {
    return this.http.post('/seller/setDefaultImage', data);
  }

  addDefaultKeyForSeller(editObj, productName, countryId, languageId) {
    editObj['countryId'] = countryId;
    editObj['productName'] = productName;
    editObj['languageId'] = languageId;
    return editObj;
  }

  exportMyProduct() {
    if (localStorage.getItem('sellerId') && localStorage.getItem('countryId')) {
      return this.http.get('/seller/exportsLiveProductToMyProduct?sellerId=' + localStorage.getItem('sellerId') + '&countryId='
        + localStorage.getItem('countryId'));
    }
  }

}

