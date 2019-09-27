import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  user;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    // this.authService.currentUser.subscribe(user => {
    //   console.log(user)
    // })
  }

  logout() {
    this.authService.logout();
  }

}
