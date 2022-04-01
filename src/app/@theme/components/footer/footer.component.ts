import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template:
    ` <span class="created-by">
    {{'COMMON_KEYS.FOOTER1' | translate }} {{year || null}}  {{'COMMON_KEYS.FOOTER2' | translate }}
    </span> `,
})
export class FooterComponent {
  year = moment().format('YYYY');
}
