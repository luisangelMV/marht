import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from "../account/account.service";
import { Account, Device } from 'src/app/models';

const baseUrl = `${environment.apiUrl}/console`

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  private deviceSubject: BehaviorSubject<Device>;
  public device: Observable<Device>;
  account: Account;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) { 
    this.accountService.account.subscribe(x => this.account = x);
    this.deviceSubject = new BehaviorSubject<Device>(null);
    this.device = this.deviceSubject.asObservable();
    
  }

  public get deviceValue(): Device {
    return this.deviceSubject.value;
  }
  getDeviceInfo(id){
    const account = this.accountService.accountValue;
    return this.http.get(`${baseUrl}/record/${id}`);
  }
  
  getDevices(){
    const account = this.accountService.accountValue;
    return this.http.get(`${baseUrl}/${account.id}`);
  }

  deleteDevice(idDevice){
    return this.http.post(`${baseUrl}/delete-device`, {idDevice,id: this.account.id});
  }

  addDevice(params) {
    return this.http.post(`${baseUrl}/add-device`, params);
  }

  updateDevice(params) {
    return this.http.post(`${baseUrl}/update-device`, params);
  }
}
