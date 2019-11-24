import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ContactService } from 'src/app/services/contact/contact.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/identity';
import { Relationship } from 'src/app/interfaces/relationship';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private contactService: ContactService,
    private userService: UserService
  ) { }

  contacts: { relationship: Relationship, user: User }[] = [];

  ngOnInit() {
    this.contactService.getUserRelationships().subscribe(res => {
      res.relationships.forEach(relationship => {
        const id = JSON.parse(localStorage.getItem('user'))._id === relationship.sender ? relationship.recipient : relationship.sender;
        this.userService.getUserById(id).subscribe(response => {
          this.contacts.push({relationship, user: response.user});
        });
      });

      console.log(this.contacts);
    });
  }

  logout() {
    this.authService.logout();
  }

}
