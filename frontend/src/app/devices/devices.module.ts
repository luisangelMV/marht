import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import { ListComponent } from './list/list.component';
import { RecordComponent } from './record/record.component';
import { SharedModule } from '../shared/shared.module';
import { devicesComponent } from './devices.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
    ListComponent,
    RecordComponent,
    devicesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DevicesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    NgxDatatableModule
  ]
})
export class DevicesModule { }
