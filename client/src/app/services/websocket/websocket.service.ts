import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket = io(environment.url);
  constructor() { }

  join(userid) {
    this.socket.emit('userid', userid);
  }

  joinRoom(roomid) {
    this.socket.emit('roomid', roomid);
  }

  onNewFriendRequest(): Observable<any> {
    const observable = new Observable<any>(observer => {
      this.socket.on('friend-request', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  onDenyingFriendRequest(): Observable<{ user: string, message: string}> {
    const observable = new Observable<{ user: string, message: string}>(observer => {
      this.socket.on('deny-friend-request', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  onAcceptingFriendRequest(): Observable<{ user: string, message: string}> {
    const observable = new Observable<any>(observer => {
      this.socket.on('accept-friend-request', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  typing(data) {
    this.socket.emit('typing', data);
  }

  receivedTyping(): Observable<any> {
    const observable = new Observable<any>(observer => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  sendMessage(data) {
    this.socket.emit('message', data);
  }

  onMessage(): Observable<any> {
    const observable = new Observable<any>(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

}
