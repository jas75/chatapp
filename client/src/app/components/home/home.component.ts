import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

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
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForms();
  }

  private createForms() {
    if (this.loggingIn) {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
    } else {
      this.registerForm = this.formBuilder.group({
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        username: ['', [
          Validators.required
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(5)
        ]],
        confPassword: ['', Validators.required]
      },
       {
        validator: this.checkIfMatchingPasswords('password', 'confPassword')
      });
    }
  }


  private checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true});
      } else {
          return passwordConfirmationInput.setErrors(null);
      }
    };
  }
  switchForm() {
    this.loggingIn = !this.loggingIn;
    this.createForms();
  }

  submitLoginForm() {

  }

  submitRegisterForm() {

    if (this.registerForm.valid) {
      const newUser = {
        email: this.registerForm.get('email').value,
        username: this.registerForm.get('username').value,
        password: this.registerForm.get('password').value
      };
  
      console.log(newUser);
      // this.authService.register().subscribe(res => {
      //   console.log(res);
      // });
    }
  }
}
