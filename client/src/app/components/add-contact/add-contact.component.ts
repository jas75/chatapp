import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {


  searchForm: FormGroup;

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
        // cree service qi fait appel http vers get api/conatct/
        this.userService.getUsersSuggestions(value.queryParams).subscribe(res => {
          console.log(res)
        })
      }
    });
  }

}
