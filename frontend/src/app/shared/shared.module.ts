import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ModalComponent } from './modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartComponent } from './chart/chart.component';
import { DynamicDirective } from './dynamic/dynamic.directive';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    ModalComponent,
    ChartComponent,
    DynamicDirective
  ],
  entryComponents: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ChartsModule,
    NgbModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    ModalComponent,
    ChartComponent
  ]
})
export class SharedModule { }
