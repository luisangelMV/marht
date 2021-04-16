import { Component, OnInit } from '@angular/core';

import { AccountService } from "../../services";
import { Account, Role } from "../../models";
import { faHome, faMicrochip, faPowerOff, faUserCircle, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { faChartBar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {


  Role = Role;
  account: Account;
  ruta: string;
  fauser = faUserCircle;
  fapower = faPowerOff;
  faAdmin = faUserShield;
  faChart = faChartBar;
  faHome  = faHome;
  faDevice = faMicrochip;

  constructor(
    private accountService: AccountService,
    private route: Router
  ) {
    this.accountService.account.subscribe(x => this.account = x);
    this.ruta = this.route.url
  }

  ngOnInit(): void {


  }

  logout() {
    this.accountService.logout();
  }

}
