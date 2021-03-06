import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Relationship, Room } from 'src/app/interfaces/relationship';
import { User } from 'src/app/interfaces/identity';
import { ContactService } from 'src/app/services/contact/contact.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  chatForm: FormGroup;

  constructor(
    private contactService: ContactService,
    private wsService: WebsocketService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();

    // create a room
    this.wsService.joinRoom(this.room.relationship._id);

    // When user accept my friend request form is not disabled anymore
    this.wsService.onAcceptingFriendRequest().subscribe(() => {
      this.room.relationship.areFriends = true;
    });

    this.onChanges()
    ;
    this.wsService.receivedTyping().subscribe(res => {
      this.isTyping = res.user === this.room.contact._id && res.isTyping ? true : false;
    });

    this.wsService.onMessage().subscribe(res => {
      const message = {
        _id: 'gbhn',
        sender: res.sender_id,
        content: res.content,
        dateCreation: new Date()
      };

      this.room.relationship.messages.push(message);
    });

    this.showFriendRequest();
  }

  onChanges() {
    this.chatForm.valueChanges.subscribe(value => {
      this.wsService.typing({ room: this.room.relationship._id, user: this.currentUser._id, input: value.text });
    });
  }

  private createForm() {
    this.chatForm = this.formBuilder.group({
      text: ['', Validators.required ]
    });
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

  onSubmit() {
    if (this.chatForm.valid) {
      const newMessage = {
        room_id: this.room.relationship._id,
        sender_id: this.currentUser._id,
        content: this.chatForm.controls.text.value
      };
      this.chatForm.reset();
      this.wsService.sendMessage(newMessage);
    }
  }
}
