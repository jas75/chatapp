import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/identity';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {


  searchForm: FormGroup;

  users: User[];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.createForm();
    this.onInputSearchChange();
  }

  private createForm() {
    this.searchForm = this.formBuilder.group({
      queryParams: ['', [
        Validators.required,
        Validators.minLength(3)
      ]]
    });
  }

  onInputSearchChange() {
    this.searchForm.valueChanges.subscribe(value => {
      if (this.searchForm.valid) {
        this.userService.getUsersSuggestions(value.queryParams).subscribe(res => {
          if (res === null) {
            this.users = [];
          } else {
            this.users = res.users;
          }
        });
      } else {
        this.users = [];
      }
    });
  }

}
