import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';

import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbMenuModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbContextMenuModule,
  NbThemeModule,

} from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../@theme/theme.module';

import {
  NbLayoutModule,
} from '@nebular/theme';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { ShareModule } from '../share/share.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  imports: [
    AuthRoutingModule,
    ThemeModule,
    NbLayoutModule,
    NbMenuModule,
    CommonModule,
    ShareModule,
    ReactiveFormsModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    TranslateModule,
    NbContextMenuModule,
    NbThemeModule,
    NgxCaptchaModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent
  ],
})
export class AuthModule { }
