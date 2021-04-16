import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceRoutingModule } from './device-routing.module';
import { LayoutComponent } from './layout.component';
import { CreateComponent } from './create/create.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    LayoutComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    DeviceRoutingModule,
    FontAwesomeModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class DeviceModule { }
