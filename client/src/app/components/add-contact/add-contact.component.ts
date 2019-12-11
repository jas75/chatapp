import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/identity';
import { ContactService } from 'src/app/services/contact/contact.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {


  @Output() fqSent: any = new EventEmitter<any>();

  searchForm: FormGroup;

  cards: Array<{ user: User, relation: boolean }> = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.createForm();
    this.onInputSearchChange();
  }

  private createForm(): void {
    this.searchForm = this.formBuilder.group({
      queryParams: ['', [
        Validators.required,
        Validators.minLength(3)
      ]]
    });
  }

  onInputSearchChange(): void {
    // when user input
    this.searchForm.valueChanges.subscribe(value => {
      if (this.searchForm.valid) {
        // get user suggestion from input
        this.userService.getUsersSuggestions(value.queryParams).subscribe(usersugg => {
          // display nothing
          if (usersugg === null) {
            this.cards = [];
          } else {
            this.cards = [];
            usersugg.users.forEach(user => {
              this.contactService.getUserRelationshipById(user._id).subscribe(relation => {
                // tslint:disable-next-line: no-shadowed-variable
                let value: boolean;
                relation ? value = true : value = false;
                this.cards.push({ user, relation: value});
              });
            });
          }
        });
      } else {
        this.cards = [];
      }
    });
  }

  sendFriendRequest(id): void {
    const recipient = {
      recipient: id
    };

    this.contactService.sendFriendRequestTo(recipient).subscribe(res => {
      if (res.status === 'OK') {

        // Sent to parent coomponent to reload Relationships
        this.fqSent.emit(null);
        // disable ADD FRIEND button
        this.cards = this.cards.map(el => {
          if (el.user._id === id) {
            el.relation = true;
          }
          return el;
        });
      }
    });
  }

}
