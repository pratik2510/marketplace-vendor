import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbContextMenuModule, NbMenuModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';
import { SelectLanguageComponent } from './select-language/select-language.component';

@NgModule({
  declarations: [
    SelectLanguageComponent
  ],
  imports: [
    CommonModule,
    NbMenuModule,
    NbContextMenuModule,
    ReactiveFormsModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule
  ],
  exports:[
    SelectLanguageComponent
  ]
})
export class ShareModule { }
