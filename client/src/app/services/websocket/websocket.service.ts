import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket = io('http://localhost:3000');
  constructor() { }

  sendMessage(data) {
    this.socket.emit('message', data);
  }

  onNewFriendRequest() {
    const observable = new Observable<{ user: string, message: string}>(observer => {
      this.socket.on('friend-request', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

}
