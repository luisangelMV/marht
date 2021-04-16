import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console.component';
import { ConsoleRoutingModule } from "./console-routing.module";
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './list/list.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { RecordComponent } from './record/record.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ConsoleComponent,
    ListComponent,
    AddDeviceComponent,
    RecordComponent
  ],
  imports: [
    CommonModule,
    ConsoleRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ConsoleModule { }
