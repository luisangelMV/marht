import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from "../account/account.service";
import { DeviceService } from "../device/device.service";
import { Group } from '../../models/group';
import { Account } from 'src/app/models';

const baseUrl = `${environment.apiUrl}/console`

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  private groupSubject: BehaviorSubject<Group>;
  public group: Observable<Group>;
  account: Account;

  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private deviceService: DeviceService
  ) { 
    this.accountService.account.subscribe(x => this.account = x);
    this.groupSubject = new BehaviorSubject<Group>(null);
    this.group = this.groupSubject.asObservable();
    
  }
  

  getGroup(){
    const account = this.accountService.accountValue;
    return this.http.get<Group>(`${baseUrl}/${account.id}`);
  }

  createGroup(params){
    return this.http.post<Group>(`${baseUrl}/create-group`, params);
  }

  getAll(){
    const account = this.accountService.accountValue;
    return this.http.get(`${baseUrl}/${account.id}`);
  }
}
