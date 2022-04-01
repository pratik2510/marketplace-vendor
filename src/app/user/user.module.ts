import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NbButtonModule, NbCardModule, NbContextMenuModule, NbInputModule, NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';


@NgModule({
  declarations: [
    UserComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NbMenuModule,
    NbContextMenuModule,
    ThemeModule,
    TranslateModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
    ChipsModule,
    NbButtonModule
  ]
})
export class UserModule { }
