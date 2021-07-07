import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console.component';
import { ConsoleRoutingModule } from "./console-routing.module";
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './list/list.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    ConsoleComponent,
    ListComponent,
    AddDeviceComponent
  ],
  imports: [
    CommonModule,
    ConsoleRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class ConsoleModule { }
