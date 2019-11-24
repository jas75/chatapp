import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  loginForm: FormGroup;
  registerForm: FormGroup;

  loggingIn = false;

  errorMsg = null;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private wsService: WebsocketService
  ) {

   }

  ngOnInit() {
    this.createForms();
    this.wsService.sendMessage('test');
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
        confPassword: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])]
      },
       {
        validator: this.passwordMatchValidator
      });
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confPassword').setErrors({ NoPassswordMatch: true });
    }
  }

  switchForm(): void {
    this.loggingIn = !this.loggingIn;
    this.createForms();
  }

  submitLoginForm(): void {
    this.loading = true;
    if (this.loginForm.valid) {
      const user = {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      };

      this.authService.login(user).subscribe(identity => {
        this.loading = false;
        this.router.navigate([`/${identity.user.username}`]);
      },
      err => {
        this.loading = false;
        if (err.status === 400) {
          if (err.error.msg === 'User does not exists') {
            this.errorMsg = err.error.msg;
          }

          if (err.error.msg === 'Email and password don\'t match') {
            this.errorMsg = err.error.msg;
          }
        }
      });
    }
  }

  submitRegisterForm(): void {

    this.loading = true;

    if (this.registerForm.valid) {
      const newUser = {
        email: this.registerForm.get('email').value,
        username: this.registerForm.get('username').value,
        password: this.registerForm.get('password').value
      };

      this.authService.register(newUser).subscribe(res => {

        delete newUser.username;

        this.authService.login(newUser).subscribe(identity => {
          this.loading = false;
          this.router.navigate([`/${identity.user.username}`]);
        });
      },
      err => {
        this.loading = false;
        if (err.status === 400) {
          if (err.error.msg === 'User already exists') {
            this.errorMsg = err.error.msg;
          }
        }
      });
    }
  }
}
