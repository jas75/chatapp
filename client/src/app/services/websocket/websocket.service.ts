import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket = io('http://localhost:3000');
  constructor() { }

  sendMessage(data) {
    this.socket.emit('message', data);
  }

}
