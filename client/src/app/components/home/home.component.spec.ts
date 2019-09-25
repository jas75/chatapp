import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('Register Form', () => {
    it('should be an empty and invalid register form', () => {
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('email field validity', () => {
      const email = component.registerForm.controls.email;
      expect(email.valid).toBeFalsy();
      email.setValue('tggrf');
      expect(email.errors).toBeTruthy();
      email.setValue('test@gmail.com');
      expect(email.errors).toBeFalsy();
      expect(email.valid).toBeTruthy();
    });

    it('username field validity', () => {
      const username = component.registerForm.controls.username;
      expect(username.valid).toBeFalsy();
      username.setValue('test');
      expect(username.errors).toBeFalsy();
      expect(username.valid).toBeTruthy();
    });

    it('password field validity', () => {
      const password = component.registerForm.controls.password;
      expect(password.valid).toBeFalsy();
      password.setValue('test');
      expect(password.errors).toBeTruthy();
      password.setValue('test2');
      expect(password.valid).toBeTruthy();
      expect(password.errors).toBeFalsy();
    });

    it('confPassword field validity', () => {
      const password = component.registerForm.controls.password;
      const confPassword = component.registerForm.controls.confPassword;
      expect(confPassword.valid).toBeFalsy();
      password.setValue('aaaaa');
      confPassword.setValue('bbbbb');
      expect(confPassword.valid).toBeFalsy();
      confPassword.setValue('aaaaa');
      expect(confPassword.valid).toBeTruthy();
    });
  });

  it('should be an invalid login form', () => {
    component.switchForm();
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    expect(component.registerForm.valid).toBeFalsy();
  });


});
