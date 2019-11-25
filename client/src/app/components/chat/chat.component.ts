import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Relationship } from 'src/app/interfaces/relationship';
import { User } from 'src/app/interfaces/identity';
import { ContactService } from 'src/app/services/contact/contact.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css', './../dashboard/dashboard.component.css']
})
export class ChatComponent implements OnInit {

  @Input() room: { relationship: Relationship, contact: User };
  @Output() decision: EventEmitter<any> = new EventEmitter();

  currentUser: User = JSON.parse(localStorage.getItem('user'));

  isFriendRequest = false;

  constructor(
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.showFriendRequest();
  }

  showFriendRequest() {
    if (this.currentUser._id !== this.room.relationship.sender &&
        this.room.relationship.areFriends === false &&
        this.room.relationship.messages.length === 1
      ) {
        this.isFriendRequest = true;
      }
  }

  acceptFriendRequest() {
    const sender = {
      sender: this.room.relationship.sender
    };

    this.contactService.acceptFriendRequest(sender).subscribe(res => {
      this.isFriendRequest = false;
      this.room.relationship.areFriends = true;
      console.log(res);
    });
  }

  denyFriendRequest() {
    this.contactService.denyFriendRequest(this.room.relationship.sender).subscribe(res => {
      console.log(res);
      this.decision.emit(null);
    });
  }
}
