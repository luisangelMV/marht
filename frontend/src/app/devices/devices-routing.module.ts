import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { devicesComponent } from './devices.component';

const routes: Routes = [
  {
    path: '', component: devicesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
