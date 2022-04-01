import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MainComponent } from './main/main.component';
import { NbButtonModule, NbCardModule, NbMenuModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { ChartModule } from 'angular2-chartjs';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import {
  NgbAccordionModule
} from '@ng-bootstrap/ng-bootstrap';
import { CommonComponentModule } from '../common-component/common-component.module';

@NgModule({
  declarations: [
    DashboardComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NbMenuModule,
    ThemeModule,
    NbCardModule,
    ChartModule,
    TableModule,
    DropdownModule,
    ReactiveFormsModule,
    CalendarModule,
    TranslateModule,
    ChartsModule,
    NgbAccordionModule,
    NbButtonModule,
    CommonComponentModule,
    NbTooltipModule
  ]
})
export class DashboardModule { }
