import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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
