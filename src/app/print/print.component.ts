import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../order/service/order.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {

  previewHTML;
  convertHTML;

  constructor(
    private activeRoute: ActivatedRoute,
    private orderService: OrderService,
    private sanitizer: DomSanitizer
  ) {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('nb-theme-default');
    setTimeout(() => {
      body.classList.remove('nb-theme-dark');
    }, 500);
    this.convertHTML = this.sanitizer;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(paramsObj => {
      if (paramsObj[`orderId`]) {
        this.DownloadPO(paramsObj[`orderId`]);
      }
    });
  }

  DownloadPO(orderId) {
    this.orderService.downloadPO(orderId).toPromise().then((res: any) => {
      this.previewHTML = res;
    }).catch(err => { });
  }

  print() {
    window.print();
  }

  convertToPDF() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }
}
