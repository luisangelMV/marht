import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Account } from 'src/app/models';
import { AdminService } from 'src/app/services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts: any[];

    constructor(private adminService: AdminService) {}

    ngOnInit() {
        this.adminService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }

    deleteAccount(id: string) {
        const account = this.accounts.find(x => x.id === id);
        account.isDeleting = true;
        this.adminService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.accounts = this.accounts.filter(x => x.id !== id) 
            });
    }
}