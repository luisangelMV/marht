import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000',{
      withCredentials: true
    });
  }
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
  on(event: string) {
    return new Observable(observer => {
      this.socket.on(event, msg => {
        observer.next(msg);
      });
    });
  }
}
