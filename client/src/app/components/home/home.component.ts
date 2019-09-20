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

  loggingIn = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createForms();
  }

  createForms() {
    if (this.loggingIn) {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
    } else {
      this.registerForm = this.formBuilder.group({
        email: ['', Validators.required],
        alias: ['', Validators.required],
        password: ['', Validators.required],
        confPassword: ['', Validators.required]
      });
    }
  }
  switchForm() {
    this.loggingIn = !this.loggingIn;
    this.createForms();
  }

  submitLoginForm() {

  }

  submitRegisterForm() {

  }
}
