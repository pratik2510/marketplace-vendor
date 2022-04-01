import { Component, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { ShareModuleService } from '../service/share-module.service';

@Component({
  selector: 'ngx-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageComponent implements OnInit {

  language = [
    { title: 'English' }];

  constructor(
    private menuService: NbMenuService,
    private sharedService: ShareModuleService
  ) { }

  ngOnInit(): void {
    this.menuService.onItemClick().pipe(filter(({ tag }) => tag === 'my-context-menu'),
      map(({ item: { title } }) => title)).subscribe(title => {
        if (title === 'Spanish') {
          this.sharedService.changeLanguageMessage('es');
        } else {
          this.sharedService.changeLanguageMessage('en');
        }
      });
  }

}
