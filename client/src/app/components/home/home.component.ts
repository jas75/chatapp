import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  loginForm: FormGroup;
  registerForm: FormGroup;

  loggingIn = true;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  }
  
  submitLoginForm() {

  }

  submitRegisterForm() {
    
  }
}
