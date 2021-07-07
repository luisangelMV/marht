import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ModalComponent } from './modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataRecordComponent } from './data-record/data-record.component';
import { DataTablesModule } from 'angular-datatables';



@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    ModalComponent,
    DataRecordComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    DataTablesModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    ModalComponent,
    DataRecordComponent
  ]
})
export class SharedModule { }
