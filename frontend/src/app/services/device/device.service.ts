import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from 'src/app/models';
import { Group } from 'src/app/models/group';
import { environment } from 'src/environments/environment';
import { Device } from '../../models/device';
import { AccountService } from '../account/account.service';


const baseUrl = `${environment.apiUrl}/console`

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private deviceSubject: BehaviorSubject<Device>;
  public device: Observable<Device>;
  account: Account;
  private groupSunject: BehaviorSubject<Group>;
  public group: Observable<Group>;

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

  getDevice() {
    return this.http.get<Device>(`${baseUrl}/device/${this.account.id}`);
  }

  addDevice(params) {
    return this.http.post(`${baseUrl}/add-device`, params);
  }

  deleteDevice(idDevice){
    return this.http.post(`${baseUrl}/delete-device`, {idDevice,id: this.account.id});
  }
}
