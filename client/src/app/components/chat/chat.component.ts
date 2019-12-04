import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Relationship, Room } from 'src/app/interfaces/relationship';
import { User } from 'src/app/interfaces/identity';
import { ContactService } from 'src/app/services/contact/contact.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css', './../dashboard/dashboard.component.css']
})
export class ChatComponent implements OnInit {

  @Input() room: Room;
  @Output() decision: EventEmitter<any> = new EventEmitter();

  currentUser: User = JSON.parse(localStorage.getItem('user'));

  isTyping = false;
  isFriendRequest = false;

  constructor(
    private contactService: ContactService,
    private wsService: WebsocketService
  ) {}

  ngOnInit() {
    //console.log(this.room.contact._id);
    // create a room
    this.wsService.joinRoom(this.room.relationship._id);

    // When user accept my friend request form is not disabled anymore
    this.wsService.onAcceptingFriendRequest().subscribe(() => {
      this.room.relationship.areFriends = true;
    });

    this.wsService.receivedTyping().subscribe(res => {
      if (res.user === this.room.contact._id && res.isTyping) {
        this.isTyping = res.isTyping;
      }
    });

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
    });
  }

  denyFriendRequest() {
    this.contactService.denyFriendRequest(this.room.relationship.sender).subscribe(res => {
      this.decision.emit(null);
    });
  }

  typing() {
    this.wsService.typing({ room: this.room.relationship._id, user: this.currentUser._id });
  }
}
