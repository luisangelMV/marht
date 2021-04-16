import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services';
import { Account, Role } from "../../models";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  Role = Role;
  account: Account;
  constructor(
    private accountService: AccountService
  ) { 
    this.accountService.account.subscribe(x => this.account = x);
  }

  logout(){
    this.accountService.logout();
  }
}
