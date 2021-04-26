import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ModalComponent } from './modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    ModalComponent
  ]
})
export class SharedModule { }
