import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Account } from "../../models/account";

const baseUrl = `${environment.apiUrl}/admin`

@Injectable({ providedIn: 'root' })
export class AdminService {

  private adminSubject: BehaviorSubject<Account>;
  public admin: Observable<Account>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.adminSubject = new BehaviorSubject<Account>(null);
    this.admin = this.adminSubject.asObservable();
  }

  public get adminValue(): Account {
    return this.adminSubject.value;
  }

  getAll() {
    return this.http.get<Account[]>(`${baseUrl}/accounts`);
  }

  getById(id: string) {
    return this.http.get<Account>(`${baseUrl}/accounts/${id}`);
  }

  create(params) {
    return this.http.post(`${baseUrl}/accounts`, params);
  }

  update(id, params) {
    return this.http.put(`${baseUrl}/accounts/${id}`, params)
      .pipe(map((account: any) => {
        // update the current account if it was updated
        if (account.id === this.adminValue.id) {
          // publish updated account to subscribers
          account = { ...this.adminValue, ...account };
          this.adminSubject.next(account);
        }
        return account;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}/accounts/${id}`)
      .pipe(finalize(() => {
        // auto logout if the logged in account was deleted
      }));
  }

  logout() {
    this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
    this.stopRefreshTokenTimer();
    this.adminSubject.next(null);
    this.router.navigate(['/']);
  }

   createDevice(params) {
    return this.http.post(`${baseUrl}/create`, params)//cambiar de ligar a admin
  }

  private refreshTokenTimeout;

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
