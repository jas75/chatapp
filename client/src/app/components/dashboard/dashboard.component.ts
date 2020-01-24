import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ContactService } from 'src/app/services/contact/contact.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/identity';
import { Relationship, Room } from 'src/app/interfaces/relationship';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private contactService: ContactService,
    private userService: UserService,
    private router: Router,
    private wsService: WebsocketService
  ) { }

  currentUser: User = JSON.parse(localStorage.getItem('user'));
  contacts: Room[] = [];
  selectedPage: number = null;
  room: Room;
  currentRoom: string;

  ngOnInit() {
    // create a connection between currentUser and server
    this.wsService.join(this.currentUser._id);
    this.wsService.onNewFriendRequest().subscribe(() => {
      this.getUserRelationships();
    });
    this.wsService.onDenyingFriendRequest().subscribe(() => {
       this.getUserRelationships();
    });
    this.getUserRelationships();
  }

  onRoomClick(room) {
    this.selectedPage = 1;
    this.room = room;
  }

  getUserRelationships() {
    this.contacts = [];
    this.contactService.getUserRelationships().subscribe(res => {
      res.relationships.forEach(relationship => {
        const id = JSON.parse(localStorage.getItem('user'))._id === relationship.sender ? relationship.recipient : relationship.sender;
        this.userService.getUserById(id).subscribe(response => {
          this.contacts.push({relationship, contact: response.user});
        });
      });
    });
  }

  onDenyFQ(event) {
    this.selectedPage = null;
    this.getUserRelationships();
  }

  onFriendRequest(event) {
    this.getUserRelationships();
  }

  logout() {
    this.authService.logout();
  }

}
